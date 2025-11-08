/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICacheRepository } from '@/infra/interfaces/icache.repository'
import { IUserRepository } from '../interfaces/iuser.repository'
import { User, Prisma, PrismaClient } from '@prisma/client'
import { UserEntity } from '../../entities/User.entity'

export class PrismaUserRepository implements IUserRepository {
  private readonly CACHE_PREFIX = 'users'
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
  async create(data: Prisma.UserUncheckedCreateInput): Promise<UserEntity> {
    try {
      const user = await this.prismaClient.user.create({ data })
      // ✅ Invalida tanto get quanto list
      await this.invalidateListCache(data.account_id)

      return this.toEntity(user)
    } catch (error) {
      this.logger.error('Error create user', error)
      throw error
    }
  }

  // ========================
  // * READ ITEM - cRud
  // ========================
  async get(account_id: number, id: number): Promise<UserEntity | null> {
    const keyCache = `${this.CACHE_PREFIX}:account:${account_id}:get:${id}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const user = await this.prismaClient.user.findFirst({
            where: { account_id, id },
          })
          return user ? JSON.stringify(user) : null
        },
        this.CACHE_TTL,
      )

      if (!cached) {
        this.logger.debug(`User not found: ${id}`)
        return null
      }

      try {
        const parsed = JSON.parse(cached)
        return this.toEntity(parsed)
      } catch (parseError) {
        this.logger.error(`Error parsing cached user: ${id}`, parseError)
        await this.cacheRepository.delete(keyCache)
        return await this.get(account_id, id)
      }
    } catch (error) {
      this.logger.error(`Error getting user: ${id}`, error)
      throw error
    }
  }

  // ========================
  // * UPDATE ITEM - crUd
  // ========================
  async update(
    account_id: number,
    id: number,
    data: Prisma.UserUncheckedUpdateInput,
  ): Promise<UserEntity> {
    try {
      const user = await this.prismaClient.user.update({
        where: { id },
        data,
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(
          `${this.CACHE_PREFIX}:account:${account_id}:get:${id}`,
        ),
        this.invalidateListCache(account_id),
      ])
      return this.toEntity(user)
    } catch (error) {
      this.logger.error(`Error updating user ${id}:`, error)
      throw error
    }
  }

  // ========================
  // * DELETE ITEM - cruD
  // ========================
  async delete(account_id: number, id: number): Promise<boolean> {
    try {
      await this.prismaClient.user.delete({
        where: { id },
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(
          `${this.CACHE_PREFIX}:account:${account_id}:get:${id}`,
        ),
        this.invalidateListCache(account_id),
      ])
      return true
    } catch (error) {
      this.logger.error(`Error deleting user ${id}:`, error)
      throw error
    }
  }

  // ========================
  // * LIST ITEMS - PAGINATED
  // ========================
  async list(
    account_id: number,
    page: number,
    active: number,
    username?: string,
  ): Promise<{
    users: UserEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }> {
    const cacheKey = this.buildListCacheKey(account_id, page, active, username)
    try {
      // ✅ Tentar cache primeiro
      const cached = await this.cacheRepository.get(cacheKey)
      if (cached) {
        return this.parseListResponse(cached)
      }

      // ✅ Buscar do banco
      const response = await this.fetchListUsers(
        account_id,
        page,
        active,
        username,
      )

      // ✅ Cachear resultado
      await this.cacheRepository.set(
        cacheKey,
        JSON.stringify(response),
        this.LIST_CACHE_TTL,
      )
      return response
    } catch (error) {
      this.logger.error('Error listing users:', error)
      throw error
    }
  }

  // ========================
  // * LIST ITEMS - ALL
  // ========================
  async listAll(account_id: number, active: number): Promise<UserEntity[]> {
    const keyCache = `${this.CACHE_PREFIX}:account:${account_id}:list:all:active:${active}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const user = await this.prismaClient.user.findMany({
            where: { account_id, active },
          })
          return user ? JSON.stringify(user) : null
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
          `Error parsing cached list all user: active ${active}`,
          parseError,
        )
        await this.cacheRepository.delete(keyCache)
        return await this.listAll(account_id, active)
      }
    } catch (error) {
      this.logger.error(`Error getting user: active ${active}`, error)
      throw error
    }
  }

  // ========================
  // * FIND ITEM
  // ========================
  async findByUsername(
    account_id: number,
    username: string,
  ): Promise<UserEntity | null> {
    try {
      const user = await this.prismaClient.user.findFirst({
        where: { account_id, username },
      })
      if (!user) return null
      return this.toEntity(user)
    } catch (error) {
      this.logger.error(`Error getting user by name: ${username}`, error)
      throw error
    }
  }

  // ========================
  // ? HELPERS
  // ========================

  // ========================
  // * SET ENTITY
  // ========================
  private toEntity(user: User): UserEntity {
    return new UserEntity(
      user.id,
      user.account_id,
      user.username,
      user.password,
      user.user_type,
      user.access_profile,
      user.reset_password ?? 0,
      user.active,
      user.created_at,
      user.updated_at,
    )
  }

  // ========================
  // * INVALIDATE CACHE
  // ========================
  /**
   * ✅ Invalida todas as listas
   * Chamada em create/update/delete de user
   */
  async invalidateListCache(account_id: number): Promise<void> {
    try {
      // ✅ Deletar todas as pages com padrão "list"
      await this.cacheRepository.deleteKeysByPrefix(
        `${this.CACHE_PREFIX}:account:${account_id}:list`,
      )
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
    account_id: number,
    page: number,
    active: number,
    username?: string,
  ): string {
    const parts = [
      this.CACHE_PREFIX,
      `account:${account_id}`,
      'list',
      `page:${page}`,
      `active:${active}`,
    ]
    // ✅ Apenas adiciona name se existir
    if (username) {
      parts.push(`username:${this.sanitizeForCache(username)}`)
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
    users: UserEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  } {
    try {
      const parsed = JSON.parse(cached)

      // ✅ Validar estrutura
      if (!parsed.users || !parsed.meta) {
        throw new Error('Invalid cache structure')
      }

      // ✅ Converter para entidades
      return {
        users: parsed.users.map((acc: any) => this.toEntity(acc)),
        meta: parsed.meta,
      }
    } catch (error) {
      this.logger.error('Error parsing list cache:', error)
      throw error
    }
  }

  // ========================
  // * FETCH LIST USERS
  // ========================
  /**
   * ✅ Busca dados do banco
   */
  private async fetchListUsers(
    account_id: number,
    page: number,
    active: number,
    username?: string,
  ): Promise<{
    users: UserEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }> {
    // ✅ Validar página
    const validPage = Math.max(1, page)
    const take = this.PAGINATION_SIZE
    const skip = (validPage - 1) * take

    // ✅ Construir where dinamicamente
    const where = this.buildWhereClause(account_id, active, username)

    // ✅ Buscar em paralelo
    const [users, totalCount] = await Promise.all([
      this.prismaClient.user.findMany({
        where,
        take,
        skip,
        orderBy: { created_at: 'desc' }, // ✅ Ordem consistent
      }),
      this.prismaClient.user.count({ where }),
    ])

    return {
      users: users.map((acc) => this.toEntity(acc)),
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
    account_id: number,
    active: number,
    username?: string,
  ): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = { account_id, active }

    if (username && username.trim()) {
      where.username = {
        contains: username.trim(),
      }
    }

    return where
  }
}
