import { AccountEntity } from '../entities/Account.entity'
import { IAccountRepository } from '../repositories/interfaces/iaccount.repository'

interface Request {
  active: number
  agreed: number
}

interface Response {
  accounts: AccountEntity[]
}

export class ListAllAccountsUseCase {
  constructor(private accountRepository: IAccountRepository) {}
  async execute({ active, agreed }: Request): Promise<Response> {
    const accounts = await this.accountRepository.listAll(active, agreed)

    return { accounts }
  }
}
