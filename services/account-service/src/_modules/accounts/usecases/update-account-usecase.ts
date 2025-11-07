import { AccountPartialType } from '../@dtos/AccountDTO'
import { AccountEntity } from '../entities/Account.entity'
import { IAccountRepository } from '../repositories/interfaces/iaccount.repository'

interface Request {
  account_id: number
  account_data: AccountPartialType
}
interface Response {
  accountUpdated: AccountEntity
}

export class UpdateAccountUseCase {
  constructor(private accountRepository: IAccountRepository) {}
  async execute({ account_id, account_data }: Request): Promise<Response> {
    const accountUpdated = await this.accountRepository.update(
      account_id,
      account_data,
    )
    return { accountUpdated }
  }
}
