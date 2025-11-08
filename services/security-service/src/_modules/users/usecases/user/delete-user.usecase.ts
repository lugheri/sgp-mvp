import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { IUserRepository } from '../../repositories/interfaces/iuser.repository'

interface Request {
  account_id: number
  user_id: number
}

interface Response {
  removed: boolean
}

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ account_id, user_id }: Request): Promise<Response> {
    const checkUser = await this.userRepository.get(account_id, user_id)
    if (!checkUser) {
      throw new ResourceNotFoundError()
    }
    await this.userRepository.delete(account_id, user_id)
    return { removed: true }
  }
}
