import { Prisma } from '@prisma/client'
import { RoleEntity } from '../../entities/Role.entity'

export interface IRoleRepository {
  create(data: Prisma.RoleUncheckedCreateInput): Promise<RoleEntity>
  get(id: string): Promise<RoleEntity | null>
  list(
    page: number,
    active: number,
    name?: string,
  ): Promise<{
    roles: RoleEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }>
  update(id: string, data: Prisma.RoleUncheckedUpdateInput): Promise<RoleEntity>
  delete(id: string): Promise<boolean>
  listAll(active: number): Promise<RoleEntity[]>
  findByName(name: string): Promise<RoleEntity | null>
}
