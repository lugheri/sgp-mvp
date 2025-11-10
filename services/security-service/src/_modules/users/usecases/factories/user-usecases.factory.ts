import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository'
import { PrismaUserRepository } from '../../repositories/implementations/prisma-user.repository'
import { CreateUserUseCase } from '../user/create-user.usecase'
import { PrismaClient } from '@prisma/client'
import { GetUserUseCase } from '../user/get-user.usecase'
import { ListAllUsersUseCase } from '../user/list-all-users.usecase'
import { DeleteUserUseCase } from '../user/delete-user.usecase'
import { ListUsersUseCase } from '../user/list-users.usecase'
import { UpdateUserUseCase } from '../user/update-user.usecase'
import { FindByUsernameUserUseCase } from '../user/find-by-username-user.usecase'

const cacheRepository = new RedisCacheRepository()
const prismaClient = new PrismaClient()
const userRepository = new PrismaUserRepository(cacheRepository, prismaClient)
export const UserUseCaseFactory = {
  createUser: () => new CreateUserUseCase(userRepository),
  getUser: () => new GetUserUseCase(userRepository),
  updateUser: () => new UpdateUserUseCase(userRepository),
  deleteUser: () => new DeleteUserUseCase(userRepository),
  listUsers: () => new ListUsersUseCase(userRepository),
  listAllUsers: () => new ListAllUsersUseCase(userRepository),
  findByUsernameUser: () => new FindByUsernameUserUseCase(userRepository),
}
