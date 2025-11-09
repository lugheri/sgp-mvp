import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository'
import { PrismaSystemModuleRepository } from '../repositories/implementations/prisma-system-module.repository'
import { CreateSystemModuleUseCase } from '../usecases/create-system-module.usecase'
import { PrismaClient } from '@prisma/client'
import { GetSystemModuleUseCase } from '../usecases/get-system-module.usecase'
import { ListAllSystemModulesUseCase } from '../usecases/list-all-system-modules.usecase'
import { DeleteSystemModuleUseCase } from '../usecases/delete-system-module.usecase'
import { ListSystemModulesUseCase } from '../usecases/list-system-modules.usecase'
import { UpdateSystemModuleUseCase } from '../usecases/update-system-module.usecase'
import { AddRoleSystemModuleUseCase } from '../usecases/add-role-system-module.usecase'
import { RemoveRoleSystemModuleUseCase } from '../usecases/remove-role-system-module.usecase'
import { ListRolesSystemModuleUseCase } from '../usecases/list-roles-system-module.usecase'

const cacheRepository = new RedisCacheRepository()
const prismaClient = new PrismaClient()
const systemModuleRepository = new PrismaSystemModuleRepository(
  cacheRepository,
  prismaClient,
)
export const SystemModuleUseCaseFactory = {
  createSystemModule: () =>
    new CreateSystemModuleUseCase(systemModuleRepository),
  getSystemModule: () => new GetSystemModuleUseCase(systemModuleRepository),
  updateSystemModule: () =>
    new UpdateSystemModuleUseCase(systemModuleRepository),
  deleteSystemModule: () =>
    new DeleteSystemModuleUseCase(systemModuleRepository),
  listSystemModules: () => new ListSystemModulesUseCase(systemModuleRepository),
  listAllSystemModules: () =>
    new ListAllSystemModulesUseCase(systemModuleRepository),
  addRoleSystemModuleUseCase: () =>
    new AddRoleSystemModuleUseCase(systemModuleRepository),
  removeRoleSystemModuleUseCase: () =>
    new RemoveRoleSystemModuleUseCase(systemModuleRepository),
  listRolesSystemModuleUseCase: () =>
    new ListRolesSystemModuleUseCase(systemModuleRepository),
}
