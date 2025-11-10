import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository'
import { PrismaAccessProfileRepository } from '../../repositories/implementations/prisma-access-profile.repository'
import { CreateAccessProfileUseCase } from '../create-access-profile.usecase'
import { PrismaClient } from '@prisma/client'
import { GetAccessProfileUseCase } from '../get-access-profile.usecase'
import { ListAllAccessProfilesUseCase } from '../list-all-access-profiles.usecase'
import { DeleteAccessProfileUseCase } from '../delete-access-profile.usecase'
import { ListAccessProfilesUseCase } from '../list-access-profiles.usecase'
import { UpdateAccessProfileUseCase } from '../update-access-profile.usecase'
import { AddRoleAccessProfileUseCase } from '../add-role-access-profile.usecase'
import { RemoveRoleAccessProfileUseCase } from '../remove-role-access-profile.usecase'
import { ListRolesAccessProfileUseCase } from '../list-roles-access-profile.usecase'

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
