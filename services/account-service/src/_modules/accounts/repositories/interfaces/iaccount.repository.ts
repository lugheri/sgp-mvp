import { Prisma } from '@prisma/client'
import { AccountEntity } from '../../entities/Account.entity'

export interface IAccountRepository {
  create(data: Prisma.AccountUncheckedCreateInput): Promise<AccountEntity>
  get(id: number): Promise<AccountEntity | null>
  list(
    page: number,
    active: number,
    agreed: number,
    name?: string,
  ): Promise<{
    accounts: AccountEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }>
  update(
    id: number,
    data: Prisma.AccountUncheckedUpdateInput,
  ): Promise<AccountEntity>
  delete(id: number): Promise<boolean>

  listAll(active: number, agreed: number): Promise<AccountEntity[]>
  findByName(name: string): Promise<AccountEntity | null>
}
