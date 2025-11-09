import { Prisma } from '@prisma/client'
import { AccessProfileEntity } from '../../entities/AccessProfile.entity'

export type AccessProfileWithRoles = Prisma.AccessProfileGetPayload<{
  include: { Role: true }
}>

export interface IAccessProfileRepository {
  create(
    data: Prisma.AccessProfileUncheckedCreateInput,
  ): Promise<AccessProfileEntity>
  get(account_id: number, id: number): Promise<AccessProfileEntity | null>
  list(
    account_id: number,
    page: number,
    active: number,
    name?: string,
  ): Promise<{
    access_profiles: AccessProfileEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }>
  update(
    account_id: number,
    id: number,
    data: Prisma.AccessProfileUncheckedUpdateInput,
  ): Promise<AccessProfileEntity>
  delete(account_id: number, id: number): Promise<boolean>

  listAll(account_id: number, active: number): Promise<AccessProfileEntity[]>
  findByName(
    account_id: number,
    name: string,
  ): Promise<AccessProfileEntity | null>

  // ADD ROLES
  addRole(access_profile_id: number, role_id: string): Promise<boolean>
  removeRole(access_profile_id: number, role_id: string): Promise<boolean>
  listRolesAccessProfile(
    access_profile_id: number,
  ): Promise<AccessProfileWithRoles | null>
}
