import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { AccountEntity } from '../entities/Account.entity'
import { IAccountRepository } from '../repositories/interfaces/iaccount.repository'

interface Request {
  name: string
}

interface Response {
  account: AccountEntity
}

export class FindByNameAccountUseCase {
  constructor(private accountRepository: IAccountRepository) {}
  async execute({ name }: Request): Promise<Response> {
    const account = await this.accountRepository.findByName(name)
    if (!account) {
      throw new ResourceNotFoundError()
    }
    return { account }
  }
}
