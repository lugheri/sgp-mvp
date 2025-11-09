/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICacheRepository } from '@/infra/interfaces/icache.repository'
import {
  AccessProfileWithRoles,
  IAccessProfileRepository,
} from '../interfaces/iaccess-profile.repository'
import { AccessProfile, Prisma, PrismaClient } from '@prisma/client'
import { AccessProfileEntity } from '../../entities/AccessProfile.entity'

export class PrismaAccessProfileRepository implements IAccessProfileRepository {
  private readonly CACHE_PREFIX = 'access_profiles'
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
    data: Prisma.AccessProfileUncheckedCreateInput,
  ): Promise<AccessProfileEntity> {
    try {
      const access_profile = await this.prismaClient.accessProfile.create({
        data,
      })
      // ✅ Invalida tanto get quanto list
      await this.invalidateListCache(data.account_id)

      return this.toEntity(access_profile)
    } catch (error) {
      this.logger.error('Error create accessprofile', error)
      throw error
    }
  }

  // ========================
  // * READ ITEM - cRud
  // ========================
  async get(
    account_id: number,
    id: number,
  ): Promise<AccessProfileEntity | null> {
    const keyCache = `${this.CACHE_PREFIX}:account:${account_id}:get:${id}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const access_profile =
            await this.prismaClient.accessProfile.findFirst({
              where: { account_id, id },
            })
          return access_profile ? JSON.stringify(access_profile) : null
        },
        this.CACHE_TTL,
      )

      if (!cached) {
        this.logger.debug(`Access_Profile not found: ${id}`)
        return null
      }

      try {
        const parsed = JSON.parse(cached)
        return this.toEntity(parsed)
      } catch (parseError) {
        this.logger.error(
          `Error parsing cached access_profile: ${id}`,
          parseError,
        )
        await this.cacheRepository.delete(keyCache)
        return await this.get(account_id, id)
      }
    } catch (error) {
      this.logger.error(`Error getting access_profile: ${id}`, error)
      throw error
    }
  }

  // ========================
  // * UPDATE ITEM - crUd
  // ========================
  async update(
    account_id: number,
    id: number,
    data: Prisma.AccessProfileUncheckedUpdateInput,
  ): Promise<AccessProfileEntity> {
    try {
      const accessprofile = await this.prismaClient.accessProfile.update({
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
      return this.toEntity(accessprofile)
    } catch (error) {
      this.logger.error(`Error updating access_profile ${id}:`, error)
      throw error
    }
  }

  // ========================
  // * DELETE ITEM - cruD
  // ========================
  async delete(account_id: number, id: number): Promise<boolean> {
    try {
      await this.prismaClient.accessProfile.delete({
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
      this.logger.error(`Error deleting access_profile ${id}:`, error)
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
    name?: string,
  ): Promise<{
    access_profiles: AccessProfileEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }> {
    const cacheKey = this.buildListCacheKey(account_id, page, active, name)
    try {
      // ✅ Tentar cache primeiro
      const cached = await this.cacheRepository.get(cacheKey)
      if (cached) {
        return this.parseListResponse(cached)
      }

      // ✅ Buscar do banco
      const response = await this.fetchListAccessProfiles(
        account_id,
        page,
        active,
        name,
      )

      // ✅ Cachear resultado
      await this.cacheRepository.set(
        cacheKey,
        JSON.stringify(response),
        this.LIST_CACHE_TTL,
      )
      return response
    } catch (error) {
      this.logger.error('Error listing access_profile:', error)
      throw error
    }
  }

  // ========================
  // * LIST ITEMS - ALL
  // ========================
  async listAll(
    account_id: number,
    active: number,
  ): Promise<AccessProfileEntity[]> {
    const keyCache = `${this.CACHE_PREFIX}:account:${account_id}:list:all:active:${active}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const access_profile = await this.prismaClient.accessProfile.findMany(
            {
              where: { account_id, active },
            },
          )
          return access_profile ? JSON.stringify(access_profile) : null
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
          `Error parsing cached list all access_profile: active ${active}`,
          parseError,
        )
        await this.cacheRepository.delete(keyCache)
        return await this.listAll(account_id, active)
      }
    } catch (error) {
      this.logger.error(`Error getting access_profile: active ${active}`, error)
      throw error
    }
  }

  // ========================
  // * FIND ITEM
  // ========================
  async findByName(
    account_id: number,
    name: string,
  ): Promise<AccessProfileEntity | null> {
    try {
      const accessprofile = await this.prismaClient.accessProfile.findFirst({
        where: { account_id, name },
      })
      if (!accessprofile) return null
      return this.toEntity(accessprofile)
    } catch (error) {
      this.logger.error(`Error getting accessprofile by name: ${name}`, error)
      throw error
    }
  }

  // ========================
  // ? JOIN ROLES
  // ========================

  // ========================
  // * ADD ROLE
  // ========================
  async addRole(access_profile_id: number, role_id: string): Promise<boolean> {
    try {
      await this.prismaClient.accessProfile.update({
        where: { id: access_profile_id },
        data: { Role: { connect: { id: role_id } } },
      })
      return true
    } catch (error) {
      this.logger.error(
        `Error fail to insert role: ${role_id} in profile ${access_profile_id}`,
        error,
      )
      throw error
    }
  }

  // ========================
  // * REMOVE ROLE
  // ========================
  async removeRole(
    access_profile_id: number,
    role_id: string,
  ): Promise<boolean> {
    try {
      await this.prismaClient.accessProfile.update({
        where: { id: access_profile_id },
        data: { Role: { disconnect: { id: role_id } } },
      })
      return true
    } catch (error) {
      this.logger.error(
        `Error fail to remove role: ${role_id} in profile ${access_profile_id}`,
        error,
      )
      throw error
    }
  }

  // ========================
  // * LIST ROLES ACCESS PROFILE
  // ========================
  async listRolesAccessProfile(
    access_profile_id: number,
  ): Promise<AccessProfileWithRoles | null> {
    try {
      const access_profile_rules =
        await this.prismaClient.accessProfile.findUnique({
          where: { id: access_profile_id },
          include: {
            Role: true,
          },
        })
      return access_profile_rules
    } catch (error) {
      this.logger.error(
        `Error fail to list all roles a profile ${access_profile_id}`,
        error,
      )
      throw error
    }
  }

  // ========================
  // ? HELPERS
  // ========================

  // ========================
  // * SET ENTITY
  // ========================
  private toEntity(access_profile: AccessProfile): AccessProfileEntity {
    return new AccessProfileEntity(
      access_profile.id,
      access_profile.account_id,
      access_profile.name,
      access_profile.description,
      access_profile.active,
      access_profile.created_at,
      access_profile.updated_at,
    )
  }

  // ========================
  // * INVALIDATE CACHE
  // ========================
  /**
   * ✅ Invalida todas as listas
   * Chamada em create/update/delete de accessprofile
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
    name?: string,
  ): string {
    const parts = [
      this.CACHE_PREFIX,
      `account:${account_id}`,
      'list',
      `page:${page}`,
      `active:${active}`,
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
    access_profiles: AccessProfileEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  } {
    try {
      const parsed = JSON.parse(cached)

      // ✅ Validar estrutura
      if (!parsed.access_profiles || !parsed.meta) {
        throw new Error('Invalid cache structure')
      }

      // ✅ Converter para entidades
      return {
        access_profiles: parsed.access_profiles.map((acc: any) =>
          this.toEntity(acc),
        ),
        meta: parsed.meta,
      }
    } catch (error) {
      this.logger.error('Error parsing list cache:', error)
      throw error
    }
  }

  // ========================
  // * FETCH LIST ACCESSPROFILES
  // ========================
  /**
   * ✅ Busca dados do banco
   */
  private async fetchListAccessProfiles(
    account_id: number,
    page: number,
    active: number,
    name?: string,
  ): Promise<{
    access_profiles: AccessProfileEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }> {
    // ✅ Validar página
    const validPage = Math.max(1, page)
    const take = this.PAGINATION_SIZE
    const skip = (validPage - 1) * take

    // ✅ Construir where dinamicamente
    const where = this.buildWhereClause(account_id, active, name)

    // ✅ Buscar em paralelo
    const [access_profiles, totalCount] = await Promise.all([
      this.prismaClient.accessProfile.findMany({
        where,
        take,
        skip,
        orderBy: { created_at: 'desc' }, // ✅ Ordem consistent
      }),
      this.prismaClient.accessProfile.count({ where }),
    ])

    return {
      access_profiles: access_profiles.map((acc) => this.toEntity(acc)),
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
    name?: string,
  ): Prisma.AccessProfileWhereInput {
    const where: Prisma.AccessProfileWhereInput = { account_id, active }

    if (name && name.trim()) {
      where.name = {
        contains: name.trim(),
      }
    }

    return where
  }
}
