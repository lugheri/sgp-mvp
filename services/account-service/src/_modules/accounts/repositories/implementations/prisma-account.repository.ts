/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICacheRepository } from '@/infra/interfaces/icache.repository'
import { IAccountRepository } from '../interfaces/iaccount.repository'
import { Account, Prisma, PrismaClient } from '@prisma/client'
import { AccountEntity } from '../../entities/Account.entity'

export class PrismaAccountRepository implements IAccountRepository {
  private readonly CACHE_PREFIX = 'accounts'
  private readonly CACHE_TTL = 3600 // 1 hora
  private readonly LIST_CACHE_TTL = 1800 // 30 minutos
  private readonly PAGINATION_SIZE = 20
  private readonly logger = console

  constructor(
    private cacheRepository: ICacheRepository,
    private readonly prismaClient: PrismaClient,
  ) {}

  // ========================
  // * CREATE ITEM - Crud
  // ========================
  async create(
    data: Prisma.AccountUncheckedCreateInput,
  ): Promise<AccountEntity> {
    try {
      const account = await this.prismaClient.account.create({ data })
      // ✅ Invalida tanto get quanto list
      await this.invalidateListCache()

      return this.toEntity(account)
    } catch (error) {
      this.logger.error('Error create account', error)
      throw error
    }
  }

  // ========================
  // * READ ITEM - cRud
  // ========================
  async get(id: number): Promise<AccountEntity | null> {
    const keyCache = `${this.CACHE_PREFIX}:get:${id}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const account = await this.prismaClient.account.findFirst({
            where: { id },
          })
          return account ? JSON.stringify(account) : null
        },
        this.CACHE_TTL,
      )

      if (!cached) {
        this.logger.debug(`Account not found: ${id}`)
        return null
      }

      try {
        const parsed = JSON.parse(cached)
        return this.toEntity(parsed)
      } catch (parseError) {
        this.logger.error(`Error parsing cached account: ${id}`, parseError)
        await this.cacheRepository.delete(keyCache)
        return await this.get(id)
      }
    } catch (error) {
      this.logger.error(`Error getting account: ${id}`, error)
      throw error
    }
  }

  // ========================
  // * UPDATE ITEM - crUd
  // ========================
  async update(
    id: number,
    data: Prisma.AccountUncheckedUpdateInput,
  ): Promise<AccountEntity> {
    try {
      const account = await this.prismaClient.account.update({
        where: { id },
        data,
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(`${this.CACHE_PREFIX}:get:${id}`),
        this.invalidateListCache(),
      ])
      return this.toEntity(account)
    } catch (error) {
      this.logger.error(`Error updating account ${id}:`, error)
      throw error
    }
  }

  // ========================
  // * DELETE ITEM - cruD
  // ========================
  async delete(id: number): Promise<boolean> {
    try {
      await this.prismaClient.account.delete({
        where: { id },
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(`${this.CACHE_PREFIX}:get:${id}`),
        this.invalidateListCache(),
      ])
      return true
    } catch (error) {
      this.logger.error(`Error deleting account ${id}:`, error)
      throw error
    }
  }

  // ========================
  // * LIST ITEMS - PAGINATED
  // ========================
  async list(
    page: number,
    active: number,
    agreed: number,
    name?: string,
  ): Promise<{
    accounts: AccountEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }> {
    const cacheKey = this.buildListCacheKey(page, active, agreed, name)
    try {
      // ✅ Tentar cache primeiro
      const cached = await this.cacheRepository.get(cacheKey)
      if (cached) {
        return this.parseListResponse(cached)
      }

      // ✅ Buscar do banco
      const response = await this.fetchListAccounts(page, active, agreed, name)

      // ✅ Cachear resultado
      await this.cacheRepository.set(
        cacheKey,
        JSON.stringify(response),
        this.LIST_CACHE_TTL,
      )
      return response
    } catch (error) {
      this.logger.error('Error listing accounts:', error)
      throw error
    }
  }

  // ========================
  // * LIST ITEMS - ALL
  // ========================
  async listAll(active: number, agreed: number): Promise<AccountEntity[]> {
    const keyCache = `${this.CACHE_PREFIX}:list:all:active:${active}:agreed:${agreed}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const account = await this.prismaClient.account.findMany({
            where: { active, terms_agreed: agreed },
          })
          return account ? JSON.stringify(account) : null
        },
        this.CACHE_TTL,
      )

      if (!cached) {
        return []
      }

      try {
        const parsed = JSON.parse(cached)
        return parsed.map((acc: any) => this.toEntity(acc))
      } catch (parseError) {
        this.logger.error(
          `Error parsing cached list all account: active ${active}, agreed:${agreed}`,
          parseError,
        )
        await this.cacheRepository.delete(keyCache)
        return await this.listAll(active, agreed)
      }
    } catch (error) {
      this.logger.error(
        `Error getting account: active ${active}, agreed:${agreed}`,
        error,
      )
      throw error
    }
  }

  // ========================
  // * FIND ITEM
  // ========================
  async findByName(name: string): Promise<AccountEntity | null> {
    try {
      const account = await this.prismaClient.account.findFirst({
        where: { account_name: name },
      })
      if (!account) return null
      return this.toEntity(account)
    } catch (error) {
      this.logger.error(`Error getting account by name: ${name}`, error)
      throw error
    }
  }

  // ========================
  // ? HELPERS
  // ========================

  // ========================
  // * SET ENTITY
  // ========================
  private toEntity(account: Account): AccountEntity {
    return new AccountEntity(
      account.id,
      account.account_owner,
      account.account_name,
      account.company_name,
      account.terms_agreed,
      account.public_ip ?? '',
      account.local_ip ?? '',
      account.setup_environment ?? 0,
      account.active,
      account.created_at,
      account.updated_at,
    )
  }

  // ========================
  // * INVALIDATE CACHE
  // ========================
  /**
   * ✅ Invalida todas as listas
   * Chamada em create/update/delete de account
   */
  async invalidateListCache(): Promise<void> {
    try {
      // ✅ Deletar todas as pages com padrão "list"
      await this.cacheRepository.deleteKeysByPrefix(`${this.CACHE_PREFIX}:list`)
      this.logger.info('All list cache invalidated')
    } catch (error) {
      this.logger.error('Error invalidating list cache:', error)
      // ✅ Não lança erro se falhar, apenas loga
    }
  }

  // ========================
  // * BUILD LIST CACHEKEY
  // ========================
  /**
   * ✅ Constrói cache key de forma normalizada
   * Evita keys muito longas e undefined
   */
  private buildListCacheKey(
    page: number,
    active: number,
    agreed: number,
    name?: string,
  ): string {
    const parts = [
      this.CACHE_PREFIX,
      'list',
      `page:${page}`,
      `active:${active}`,
      `agreed:${agreed}`,
    ]
    // ✅ Apenas adiciona name se existir
    if (name) {
      parts.push(`name:${this.sanitizeForCache(name)}`)
    }
    return parts.join(':')
  }

  // ========================
  // * SANITIZE FOR CACHE
  // ========================
  /**
   * ✅ Sanitiza string para usar em cache key
   * Remove caracteres especiais, limita tamanho
   */
  private sanitizeForCache(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Remove especiais
      .substring(0, 20) // Limita a 20 caracteres
  }

  // ========================
  // * PARSE LIST RESPONSE
  // ========================
  /**
   * ✅ Parse seguro da resposta em cache
   */
  private parseListResponse(cached: string): {
    accounts: AccountEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  } {
    try {
      const parsed = JSON.parse(cached)

      // ✅ Validar estrutura
      if (!parsed.accounts || !parsed.meta) {
        throw new Error('Invalid cache structure')
      }

      // ✅ Converter para entidades
      return {
        accounts: parsed.accounts.map((acc: any) => this.toEntity(acc)),
        meta: parsed.meta,
      }
    } catch (error) {
      this.logger.error('Error parsing list cache:', error)
      throw error
    }
  }

  // ========================
  // * FETCH LIST ACCOUNTS
  // ========================
  /**
   * ✅ Busca dados do banco
   */
  private async fetchListAccounts(
    page: number,
    active: number,
    agreed: number,
    name?: string,
  ): Promise<{
    accounts: AccountEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }> {
    // ✅ Validar página
    const validPage = Math.max(1, page)
    const take = this.PAGINATION_SIZE
    const skip = (validPage - 1) * take

    // ✅ Construir where dinamicamente
    const where = this.buildWhereClause(active, agreed, name)

    // ✅ Buscar em paralelo
    const [accounts, totalCount] = await Promise.all([
      this.prismaClient.account.findMany({
        where,
        take,
        skip,
        orderBy: { created_at: 'desc' }, // ✅ Ordem consistent
      }),
      this.prismaClient.account.count({ where }),
    ])

    return {
      accounts: accounts.map((acc) => this.toEntity(acc)),
      meta: {
        page: validPage,
        perPage: take,
        totalCount,
      },
    }
  }

  // ========================
  // * BUILD WHERE CLAUSE
  // ========================
  private buildWhereClause(
    active: number,
    agreed: number,
    name?: string,
  ): Prisma.AccountWhereInput {
    const where: Prisma.AccountWhereInput = {
      active,
      terms_agreed: agreed,
    }

    if (name && name.trim()) {
      where.account_name = {
        contains: name.trim(),
      }
    }

    return where
  }
}
