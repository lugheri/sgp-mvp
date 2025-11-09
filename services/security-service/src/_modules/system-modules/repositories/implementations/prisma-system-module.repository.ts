/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICacheRepository } from '@/infra/interfaces/icache.repository'
import { SystemModuleEntity } from '../../entities/SystemModule.entity'
import { Prisma, PrismaClient, SystemModule } from '@prisma/client'
import {
  ISystemModuleRepository,
  SystemModuleWithRoles,
} from '../interfaces/isystem-module.repository'

export class PrismaSystemModuleRepository implements ISystemModuleRepository {
  private readonly CACHE_PREFIX = 'system_module'
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
    data: Prisma.SystemModuleUncheckedCreateInput,
  ): Promise<SystemModuleEntity> {
    try {
      const system_module = await this.prismaClient.systemModule.create({
        data,
      })
      // ✅ Invalida tanto get quanto list
      await this.invalidateListCache()

      return this.toEntity(system_module)
    } catch (error) {
      this.logger.error('Error create system_module', error)
      throw error
    }
  }

  // ========================
  // * READ ITEM - cRud
  // ========================
  async get(id: number): Promise<SystemModuleEntity | null> {
    const keyCache = `${this.CACHE_PREFIX}:get:${id}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const system_module = await this.prismaClient.systemModule.findFirst({
            where: { id },
          })
          return system_module ? JSON.stringify(system_module) : null
        },
        this.CACHE_TTL,
      )

      if (!cached) {
        this.logger.debug(`System_Module not found: ${id}`)
        return null
      }

      try {
        const parsed = JSON.parse(cached)
        return this.toEntity(parsed)
      } catch (parseError) {
        this.logger.error(
          `Error parsing cached system_module: ${id}`,
          parseError,
        )
        await this.cacheRepository.delete(keyCache)
        return await this.get(id)
      }
    } catch (error) {
      this.logger.error(`Error getting system_module: ${id}`, error)
      throw error
    }
  }

  // ========================
  // * UPDATE ITEM - crUd
  // ========================
  async update(
    id: number,
    data: Prisma.SystemModuleUncheckedUpdateInput,
  ): Promise<SystemModuleEntity> {
    try {
      const system_module = await this.prismaClient.systemModule.update({
        where: { id },
        data,
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(`${this.CACHE_PREFIX}:get:${id}`),
        this.invalidateListCache(),
      ])
      return this.toEntity(system_module)
    } catch (error) {
      this.logger.error(`Error updating system_module ${id}:`, error)
      throw error
    }
  }

  // ========================
  // * DELETE ITEM - cruD
  // ========================
  async delete(id: number): Promise<boolean> {
    try {
      await this.prismaClient.systemModule.delete({
        where: { id },
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(`${this.CACHE_PREFIX}:get:${id}`),
        this.invalidateListCache(),
      ])
      return true
    } catch (error) {
      this.logger.error(`Error deleting system_module ${id}:`, error)
      throw error
    }
  }

  // ========================
  // * LIST ITEMS - PAGINATED
  // ========================
  async list(
    page: number,
    active: number,
    module_owner: number,
    name?: string,
    alias?: string,
  ): Promise<{
    system_modules: SystemModuleEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }> {
    const cacheKey = this.buildListCacheKey(
      page,
      active,
      module_owner,
      name,
      alias,
    )
    try {
      // ✅ Tentar cache primeiro
      const cached = await this.cacheRepository.get(cacheKey)
      if (cached) {
        return this.parseListResponse(cached)
      }

      // ✅ Buscar do banco
      const response = await this.fetchListSystem_modules(
        page,
        active,
        module_owner,
        name,
        alias,
      )

      // ✅ Cachear resultado
      await this.cacheRepository.set(
        cacheKey,
        JSON.stringify(response),
        this.LIST_CACHE_TTL,
      )
      return response
    } catch (error) {
      this.logger.error('Error listing system_module:', error)
      throw error
    }
  }

  // ========================
  // * LIST ITEMS - ALL
  // ========================
  async listAll(
    module_owner: number,
    active: number,
  ): Promise<SystemModuleEntity[]> {
    const keyCache = `${this.CACHE_PREFIX}:list:all:module_owner:${module_owner}:active:${active}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const system_module = await this.prismaClient.systemModule.findMany({
            where: { module_owner, active },
          })
          return system_module ? JSON.stringify(system_module) : null
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
          `Error parsing cached list all system_module: module_owner ${module_owner}, active ${active}`,
          parseError,
        )
        await this.cacheRepository.delete(keyCache)
        return await this.listAll(module_owner, active)
      }
    } catch (error) {
      this.logger.error(
        `Error getting system_module: module_owner ${module_owner}, active ${active}`,
        error,
      )
      throw error
    }
  }

  // ========================
  // * FIND ITEM
  // ========================
  async findByName(name: string): Promise<SystemModuleEntity | null> {
    try {
      const system_module = await this.prismaClient.systemModule.findFirst({
        where: { name },
      })
      if (!system_module) return null
      return this.toEntity(system_module)
    } catch (error) {
      this.logger.error(`Error getting system_module by name: ${name}`, error)
      throw error
    }
  }

  // ========================
  // ? JOIN ROLES
  // ========================

  // ========================
  // * ADD ROLE
  // ========================
  async addRole(system_module_id: number, role_id: string): Promise<boolean> {
    try {
      await this.prismaClient.systemModule.update({
        where: { id: system_module_id },
        data: { Role: { connect: { id: role_id } } },
      })
      return true
    } catch (error) {
      this.logger.error(
        `Error fail to insert role: ${role_id} in module ${system_module_id}`,
        error,
      )
      throw error
    }
  }

  // ========================
  // * REMOVE ROLE
  // ========================
  async removeRole(
    system_module_id: number,
    role_id: string,
  ): Promise<boolean> {
    try {
      await this.prismaClient.systemModule.update({
        where: { id: system_module_id },
        data: { Role: { disconnect: { id: role_id } } },
      })
      return true
    } catch (error) {
      this.logger.error(
        `Error fail to remove role: ${role_id} in module ${system_module_id}`,
        error,
      )
      throw error
    }
  }

  // ========================
  // * LIST ROLES SYSTEM MODULE
  // ========================
  async listRolesSystemModule(
    system_module_id: number,
  ): Promise<SystemModuleWithRoles | null> {
    try {
      const system_module_rules =
        await this.prismaClient.systemModule.findUnique({
          where: { id: system_module_id },
          include: {
            Role: true,
          },
        })
      return system_module_rules
    } catch (error) {
      this.logger.error(
        `Error fail to list all roles a module ${system_module_id}`,
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
  private toEntity(system_module: SystemModule): SystemModuleEntity {
    return new SystemModuleEntity(
      system_module.id,
      system_module.module_owner,
      system_module.name,
      system_module.alias,
      system_module.icon,
      system_module.description,
      system_module.type_module,
      system_module.order,
      system_module.active,
      system_module.created_at,
      system_module.updated_at,
    )
  }

  // ========================
  // * INVALIDATE CACHE
  // ========================
  /**
   * ✅ Invalida todas as listas
   * Chamada em create/update/delete de system_module
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
    module_owner: number,
    name?: string,
    alias?: string,
  ): string {
    const parts = [
      this.CACHE_PREFIX,
      'list',
      `page:${page}`,
      `active:${active}`,
      `module_owner:${module_owner}`,
    ]
    // ✅ Apenas adiciona name se existir
    if (name) {
      parts.push(`name:${this.sanitizeForCache(name)}`)
    }
    if (alias) {
      parts.push(`alias:${this.sanitizeForCache(alias)}`)
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
    system_modules: SystemModuleEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  } {
    try {
      const parsed = JSON.parse(cached)

      // ✅ Validar estrutura
      if (!parsed.system_module || !parsed.meta) {
        throw new Error('Invalid cache structure')
      }

      // ✅ Converter para entidades
      return {
        system_modules: parsed.system_module.map((acc: any) =>
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
  // * FETCH LIST SYSTEM_MODULES
  // ========================
  /**
   * ✅ Busca dados do banco
   */
  private async fetchListSystem_modules(
    page: number,
    active: number,
    module_owner: number,
    name?: string,
    alias?: string,
  ): Promise<{
    system_modules: SystemModuleEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }> {
    // ✅ Validar página
    const validPage = Math.max(1, page)
    const take = this.PAGINATION_SIZE
    const skip = (validPage - 1) * take

    // ✅ Construir where dinamicamente
    const where = this.buildWhereClause(active, module_owner, name, alias)

    // ✅ Buscar em paralelo
    const [system_module, totalCount] = await Promise.all([
      this.prismaClient.systemModule.findMany({
        where,
        take,
        skip,
        orderBy: { created_at: 'desc' }, // ✅ Ordem consistent
      }),
      this.prismaClient.systemModule.count({ where }),
    ])

    return {
      system_modules: system_module.map((acc) => this.toEntity(acc)),
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
    module_owner: number,
    name?: string,
    alias?: string,
  ): Prisma.SystemModuleWhereInput {
    const where: Prisma.SystemModuleWhereInput = { module_owner, active }

    if (name && name.trim()) {
      where.name = {
        contains: name.trim(),
      }
    }
    if (alias && alias.trim()) {
      where.alias = {
        contains: alias.trim(),
      }
    }

    return where
  }
}
