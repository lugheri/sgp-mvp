import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { UserEntity } from '../../entities/User.entity'
import { IUserRepository } from '../../repositories/interfaces/iuser.repository'

interface Request {
  account_id: number
  username: string
}

interface Response {
  user: UserEntity
}

export class FindByUsernameUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute({ account_id, username }: Request): Promise<Response> {
    const user = await this.userRepository.findByUsername(account_id, username)
    if (!user) {
      throw new ResourceNotFoundError()
    }
    return { user }
  }
}
