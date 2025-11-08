/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICacheRepository } from '@/infra/interfaces/icache.repository'
import { IUserInfoRepository } from '../interfaces/iuser-info.repository'
import { Prisma, PrismaClient, UserInfo } from '@prisma/client'
import { UserInfoEntity } from '../../entities/UserInfo.entity'

export class PrismaUserInfoRepository implements IUserInfoRepository {
  private readonly CACHE_PREFIX = 'user-info'
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
    data: Prisma.UserInfoUncheckedCreateInput,
  ): Promise<UserInfoEntity> {
    try {
      const userInfo = await this.prismaClient.userInfo.create({ data })

      return this.toEntity(userInfo)
    } catch (error) {
      this.logger.error('Error create userInfo', error)
      throw error
    }
  }

  // ========================
  // * READ ITEM - cRud
  // ========================
  async get(id: number): Promise<UserInfoEntity | null> {
    const keyCache = `${this.CACHE_PREFIX}:get:${id}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const userInfo = await this.prismaClient.userInfo.findFirst({
            where: { id },
          })
          return userInfo ? JSON.stringify(userInfo) : null
        },
        this.CACHE_TTL,
      )

      if (!cached) {
        this.logger.debug(`userInfo not found: ${id}`)
        return null
      }

      try {
        const parsed = JSON.parse(cached)
        return this.toEntity(parsed)
      } catch (parseError) {
        this.logger.error(`Error parsing cached userInfo: ${id}`, parseError)
        await this.cacheRepository.delete(keyCache)
        return await this.get(id)
      }
    } catch (error) {
      this.logger.error(`Error getting userInfo: ${id}`, error)
      throw error
    }
  }

  async findByUserId(user_id: number): Promise<UserInfoEntity | null> {
    const keyCache = `${this.CACHE_PREFIX}:findByUserId:${user_id}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const userInfo = await this.prismaClient.userInfo.findFirst({
            where: { user_id },
          })
          return userInfo ? JSON.stringify(userInfo) : null
        },
        this.CACHE_TTL,
      )

      if (!cached) {
        this.logger.debug(`userInfo not found: ${user_id}`)
        return null
      }

      try {
        const parsed = JSON.parse(cached)
        return this.toEntity(parsed)
      } catch (parseError) {
        this.logger.error(
          `Error parsing cached userInfo: ${user_id}`,
          parseError,
        )
        await this.cacheRepository.delete(keyCache)
        return await this.get(user_id)
      }
    } catch (error) {
      this.logger.error(`Error getting userInfo: ${user_id}`, error)
      throw error
    }
  }

  // ========================
  // * UPDATE ITEM - crUd
  // ========================
  async update(
    id: number,
    data: Prisma.UserInfoUncheckedUpdateInput,
  ): Promise<UserInfoEntity> {
    try {
      const userInfo = await this.prismaClient.userInfo.update({
        where: { id },
        data,
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(`${this.CACHE_PREFIX}:get:${id}`),
      ])
      return this.toEntity(userInfo)
    } catch (error) {
      this.logger.error(`Error updating userInfo ${id}:`, error)
      throw error
    }
  }

  // ========================
  // ? HELPERS
  // ========================

  // ========================
  // * SET ENTITY
  // ========================
  private toEntity(Info: UserInfo): UserInfoEntity {
    return new UserInfoEntity(
      Info.id,
      Info.user_id,
      Info.name,
      Info.email,
      Info.number_phone,
      Info.is_whatsapp ?? 0,
      Info.other_phone ?? '',
      Info.alternative_email ?? '',
    )
  }
}
