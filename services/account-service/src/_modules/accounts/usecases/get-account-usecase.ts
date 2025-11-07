import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { AccountEntity } from '../entities/Account.entity'
import { IAccountRepository } from '../repositories/interfaces/iaccount.repository'

interface Request {
  account_id: number
}

interface Response {
  account: AccountEntity
}

export class GetAccountUseCase {
  constructor(private accountRepository: IAccountRepository) {}
  async execute({ account_id }: Request): Promise<Response> {
    const account = await this.accountRepository.get(account_id)
    if (!account) {
      throw new ResourceNotFoundError()
    }
    return { account }
  }
}
