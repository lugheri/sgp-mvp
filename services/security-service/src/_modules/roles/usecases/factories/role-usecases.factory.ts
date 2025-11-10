import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository'
import { PrismaRoleRepository } from '../../repositories/implementations/prisma-role.repository'
import { CreateRoleUseCase } from '../create-role.usecase'
import { PrismaClient } from '@prisma/client'
import { GetRoleUseCase } from '../get-role.usecase'
import { ListAllRolesUseCase } from '../list-all-roles.usecase'
import { DeleteRoleUseCase } from '../delete-role.usecase'
import { ListRolesUseCase } from '../list-roles.usecase'
import { UpdateRoleUseCase } from '../update-role.usecase'
import { FindByNameRoleUseCase } from '../find-by-name-role.usecase'

const cacheRepository = new RedisCacheRepository()
const prismaClient = new PrismaClient()
const roleRepository = new PrismaRoleRepository(cacheRepository, prismaClient)
export const RoleUseCaseFactory = {
  createRole: () => new CreateRoleUseCase(roleRepository),
  getRole: () => new GetRoleUseCase(roleRepository),
  updateRole: () => new UpdateRoleUseCase(roleRepository),
  deleteRole: () => new DeleteRoleUseCase(roleRepository),
  listRoles: () => new ListRolesUseCase(roleRepository),
  listAllRoles: () => new ListAllRolesUseCase(roleRepository),
  findByNameRole: () => new FindByNameRoleUseCase(roleRepository),
}
