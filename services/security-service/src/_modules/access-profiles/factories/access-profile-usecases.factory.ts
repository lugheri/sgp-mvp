import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository'
import { PrismaAccessProfileRepository } from '../repositories/implementations/prisma-access-profile.repository'
import { CreateAccessProfileUseCase } from '../usecases/create-access-profile.usecase'
import { PrismaClient } from '@prisma/client'
import { GetAccessProfileUseCase } from '../usecases/get-access-profile.usecase'
import { ListAllAccessProfilesUseCase } from '../usecases/list-all-access-profiles.usecase'
import { DeleteAccessProfileUseCase } from '../usecases/delete-access-profile.usecase'
import { ListAccessProfilesUseCase } from '../usecases/list-access-profiles.usecase'
import { UpdateAccessProfileUseCase } from '../usecases/update-access-profile.usecase'
import { AddRoleAccessProfileUseCase } from '../usecases/add-role-access-profile.usecase'
import { RemoveRoleAccessProfileUseCase } from '../usecases/remove-role-access-profile.usecase'
import { ListRolesAccessProfileUseCase } from '../usecases/list-roles-access-profile.usecase'

const cacheRepository = new RedisCacheRepository()
const prismaClient = new PrismaClient()
const accessProfileRepository = new PrismaAccessProfileRepository(
  cacheRepository,
  prismaClient,
)
export const AccessProfileUseCaseFactory = {
  createAccessProfile: () =>
    new CreateAccessProfileUseCase(accessProfileRepository),
  getAccessProfile: () => new GetAccessProfileUseCase(accessProfileRepository),
  updateAccessProfile: () =>
    new UpdateAccessProfileUseCase(accessProfileRepository),
  deleteAccessProfile: () =>
    new DeleteAccessProfileUseCase(accessProfileRepository),
  listAccessProfiles: () =>
    new ListAccessProfilesUseCase(accessProfileRepository),
  listAllAccessProfiles: () =>
    new ListAllAccessProfilesUseCase(accessProfileRepository),
  addRoleAccessProfileUseCase: () =>
    new AddRoleAccessProfileUseCase(accessProfileRepository),
  removeRoleAccessProfileUseCase: () =>
    new RemoveRoleAccessProfileUseCase(accessProfileRepository),
  listRolesAccessProfileUseCase: () =>
    new ListRolesAccessProfileUseCase(accessProfileRepository),
}
