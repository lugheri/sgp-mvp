import { AccountEntity } from '../entities/Account.entity'
import { IAccountRepository } from '../repositories/interfaces/iaccount.repository'

interface Request {
  page: number
  active: number
  agreed: number
  name?: string
}

interface Response {
  accounts: AccountEntity[]
  meta: {
    page: number
    perPage: number
    totalCount: number
  }
}

export class ListAccountsUseCase {
  constructor(private accountRepository: IAccountRepository) {}
  async execute({ page, active, agreed, name }: Request): Promise<Response> {
    const accounts = await this.accountRepository.list(
      page,
      active,
      agreed,
      name,
    )

    return accounts
  }
}
