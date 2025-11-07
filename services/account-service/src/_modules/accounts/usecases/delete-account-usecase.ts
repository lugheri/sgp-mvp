import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { IAccountRepository } from '../repositories/interfaces/iaccount.repository'

interface Request {
  account_id: number
}

interface Response {
  removed: boolean
}

export class DeleteAccountUseCase {
  constructor(private accountRepository: IAccountRepository) {}

  async execute({ account_id }: Request): Promise<Response> {
    const checkAccount = await this.accountRepository.get(account_id)
    if (!checkAccount) {
      throw new ResourceNotFoundError()
    }
    await this.accountRepository.delete(account_id)
    return { removed: true }
  }
}
