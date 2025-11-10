import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository'
import { CreateUserInfoUseCase } from '../user-info/create-user-info.usecase'
import { PrismaClient } from '@prisma/client'
import { PrismaUserInfoRepository } from '../../repositories/implementations/prisma-user-info.repository'
import { GetUserInfoUseCase } from '../user-info/get-user-info.usecase'
import { UpdateUserInfoUseCase } from '../user-info/update-user-info.usecase'
import { FindByUserIdUserInfoUseCase } from '../user-info/find-by-user-id-user-info.usecase copy'

const cacheRepository = new RedisCacheRepository()
const prismaClient = new PrismaClient()
const userinfoRepository = new PrismaUserInfoRepository(
  cacheRepository,
  prismaClient,
)
export const UserInfoUseCaseFactory = {
  createUserInfo: () => new CreateUserInfoUseCase(userinfoRepository),
  getUserInfo: () => new GetUserInfoUseCase(userinfoRepository),
  findByUserIdUserInfo: () =>
    new FindByUserIdUserInfoUseCase(userinfoRepository),
  updateUserInfo: () => new UpdateUserInfoUseCase(userinfoRepository),
}
