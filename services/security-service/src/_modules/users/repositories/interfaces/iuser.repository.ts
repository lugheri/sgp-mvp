import { Prisma } from '@prisma/client'
import { UserEntity } from '../../entities/User.entity'

export interface IUserRepository {
  create(data: Prisma.UserUncheckedCreateInput): Promise<UserEntity>
  get(account_id: number, id: number): Promise<UserEntity | null>
  list(
    account_id: number,
    page: number,
    active: number,
    username?: string,
  ): Promise<{
    users: UserEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }>
  update(
    account_id: number,
    id: number,
    data: Prisma.UserUncheckedUpdateInput,
  ): Promise<UserEntity>
  delete(account_id: number, id: number): Promise<boolean>

  listAll(account_id: number, active: number): Promise<UserEntity[]>
  findByUsername(
    account_id: number,
    username: string,
  ): Promise<UserEntity | null>
}
