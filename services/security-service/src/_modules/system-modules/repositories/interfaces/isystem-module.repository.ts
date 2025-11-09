import { Prisma } from '@prisma/client'
import { SystemModuleEntity } from '../../entities/SystemModule.entity'

export type SystemModuleWithRoles = Prisma.SystemModuleGetPayload<{
  include: { Role: true }
}>

export interface ISystemModuleRepository {
  create(
    data: Prisma.SystemModuleUncheckedCreateInput,
  ): Promise<SystemModuleEntity>
  get(id: number): Promise<SystemModuleEntity | null>
  list(
    page: number,
    active: number,
    module_owner: number,
    name?: string,
    alias?: string,
  ): Promise<{
    system_modules: SystemModuleEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }>
  update(
    id: number,
    data: Prisma.SystemModuleUncheckedUpdateInput,
  ): Promise<SystemModuleEntity>
  delete(id: number): Promise<boolean>

  listAll(module_owner: number, active: number): Promise<SystemModuleEntity[]>
  findByName(name: string): Promise<SystemModuleEntity | null>

  // ADD ROLES
  addRole(system_module_id: number, role_id: string): Promise<boolean>
  removeRole(system_module_id: number, role_id: string): Promise<boolean>
  listRolesSystemModule(
    system_module_id: number,
  ): Promise<SystemModuleWithRoles | null>
}
