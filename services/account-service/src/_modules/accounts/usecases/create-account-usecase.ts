import { AccountType } from '../@dtos/AccountDTO'
import { AccountEntity } from '../entities/Account.entity'
import { AccountAlreadyExistsError } from '../errors/account-already-exists-error'
import { IAccountRepository } from '../repositories/interfaces/iaccount.repository'

interface Request {
  dataAccount: AccountType
}

interface Response {
  accountCreated: AccountEntity
}

export class CreateAccountUseCase {
  constructor(private accountsRepository: IAccountRepository) {}

  async execute({ dataAccount }: Request): Promise<Response> {
    const accountWithSameName = await this.accountsRepository.findByName(
      dataAccount.account_name,
    )
    if (accountWithSameName) {
      throw new AccountAlreadyExistsError()
    }
    const accountCreated = await this.accountsRepository.create(dataAccount)
    return { accountCreated }
  }
}
