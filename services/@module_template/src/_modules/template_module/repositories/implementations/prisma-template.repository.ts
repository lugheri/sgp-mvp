/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICacheRepository } from '@/infra/interfaces/icache.repository'
import { ITemplateRepository } from '../interfaces/itemplate.repository'
import { Template, Prisma, PrismaClient } from '@prisma/client'
import { TemplateEntity } from '../../entities/Template.entity'

export class PrismaTemplateRepository implements ITemplateRepository {
  private readonly CACHE_PREFIX = 'templates'
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
    data: Prisma.TemplateUncheckedCreateInput,
  ): Promise<TemplateEntity> {
    try {
      const template = await this.prismaClient.template.create({ data })
      // ✅ Invalida tanto get quanto list
      await this.invalidateListCache()

      return this.toEntity(template)
    } catch (error) {
      this.logger.error('Error create template', error)
      throw error
    }
  }

  // ========================
  // * READ ITEM - cRud
  // ========================
  async get(id: number): Promise<TemplateEntity | null> {
    const keyCache = `${this.CACHE_PREFIX}:get:${id}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const template = await this.prismaClient.template.findFirst({
            where: { id },
          })
          return template ? JSON.stringify(template) : null
        },
        this.CACHE_TTL,
      )

      if (!cached) {
        this.logger.debug(`Template not found: ${id}`)
        return null
      }

      try {
        const parsed = JSON.parse(cached)
        return this.toEntity(parsed)
      } catch (parseError) {
        this.logger.error(`Error parsing cached template: ${id}`, parseError)
        await this.cacheRepository.delete(keyCache)
        return await this.get(id)
      }
    } catch (error) {
      this.logger.error(`Error getting template: ${id}`, error)
      throw error
    }
  }

  // ========================
  // * UPDATE ITEM - crUd
  // ========================
  async update(
    id: number,
    data: Prisma.TemplateUncheckedUpdateInput,
  ): Promise<TemplateEntity> {
    try {
      const template = await this.prismaClient.template.update({
        where: { id },
        data,
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(`${this.CACHE_PREFIX}:get:${id}`),
        this.invalidateListCache(),
      ])
      return this.toEntity(template)
    } catch (error) {
      this.logger.error(`Error updating template ${id}:`, error)
      throw error
    }
  }

  // ========================
  // * DELETE ITEM - cruD
  // ========================
  async delete(id: number): Promise<boolean> {
    try {
      await this.prismaClient.template.delete({
        where: { id },
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(`${this.CACHE_PREFIX}:get:${id}`),
        this.invalidateListCache(),
      ])
      return true
    } catch (error) {
      this.logger.error(`Error deleting template ${id}:`, error)
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
    templates: TemplateEntity[]
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
      const response = await this.fetchListTemplates(page, active, agreed, name)

      // ✅ Cachear resultado
      await this.cacheRepository.set(
        cacheKey,
        JSON.stringify(response),
        this.LIST_CACHE_TTL,
      )
      return response
    } catch (error) {
      this.logger.error('Error listing templates:', error)
      throw error
    }
  }

  // ========================
  // * LIST ITEMS - ALL
  // ========================
  async listAll(active: number, agreed: number): Promise<TemplateEntity[]> {
    const keyCache = `${this.CACHE_PREFIX}:list:all:active:${active}:agreed:${agreed}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const template = await this.prismaClient.template.findMany({
            where: { active, terms_agreed: agreed },
          })
          return template ? JSON.stringify(template) : null
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
          `Error parsing cached list all template: active ${active}, agreed:${agreed}`,
          parseError,
        )
        await this.cacheRepository.delete(keyCache)
        return await this.listAll(active, agreed)
      }
    } catch (error) {
      this.logger.error(
        `Error getting template: active ${active}, agreed:${agreed}`,
        error,
      )
      throw error
    }
  }

  // ========================
  // * FIND ITEM
  // ========================
  async findByName(name: string): Promise<TemplateEntity | null> {
    try {
      const template = await this.prismaClient.template.findFirst({
        where: { template_name: name },
      })
      if (!template) return null
      return this.toEntity(template)
    } catch (error) {
      this.logger.error(`Error getting template by name: ${name}`, error)
      throw error
    }
  }

  // ========================
  // ? HELPERS
  // ========================

  // ========================
  // * SET ENTITY
  // ========================
  private toEntity(template: Template): TemplateEntity {
    return new TemplateEntity(
      template.id,
      template.template_owner,
      template.template_name,
      template.company_name,
      template.terms_agreed,
      template.public_ip ?? '',
      template.local_ip ?? '',
      template.setup_environment ?? 0,
      template.active,
      template.created_at,
      template.updated_at,
    )
  }

  // ========================
  // * INVALIDATE CACHE
  // ========================
  /**
   * ✅ Invalida todas as listas
   * Chamada em create/update/delete de template
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
    templates: TemplateEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  } {
    try {
      const parsed = JSON.parse(cached)

      // ✅ Validar estrutura
      if (!parsed.templates || !parsed.meta) {
        throw new Error('Invalid cache structure')
      }

      // ✅ Converter para entidades
      return {
        templates: parsed.templates.map((acc: any) => this.toEntity(acc)),
        meta: parsed.meta,
      }
    } catch (error) {
      this.logger.error('Error parsing list cache:', error)
      throw error
    }
  }

  // ========================
  // * FETCH LIST TEMPLATES
  // ========================
  /**
   * ✅ Busca dados do banco
   */
  private async fetchListTemplates(
    page: number,
    active: number,
    agreed: number,
    name?: string,
  ): Promise<{
    templates: TemplateEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }> {
    // ✅ Validar página
    const validPage = Math.max(1, page)
    const take = this.PAGINATION_SIZE
    const skip = (validPage - 1) * take

    // ✅ Construir where dinamicamente
    const where = this.buildWhereClause(active, agreed, name)

    // ✅ Buscar em paralelo
    const [templates, totalCount] = await Promise.all([
      this.prismaClient.template.findMany({
        where,
        take,
        skip,
        orderBy: { created_at: 'desc' }, // ✅ Ordem consistent
      }),
      this.prismaClient.template.count({ where }),
    ])

    return {
      templates: templates.map((acc) => this.toEntity(acc)),
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
  ): Prisma.TemplateWhereInput {
    const where: Prisma.TemplateWhereInput = {
      active,
      terms_agreed: agreed,
    }

    if (name && name.trim()) {
      where.template_name = {
        contains: name.trim(),
      }
    }

    return where
  }
}
