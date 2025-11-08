import { UserEntity } from '../../entities/User.entity'
import { IUserRepository } from '../../repositories/interfaces/iuser.repository'

interface Request {
  account_id: number
  active: number
}

interface Response {
  users: UserEntity[]
}

export class ListAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute({ account_id, active }: Request): Promise<Response> {
    const users = await this.userRepository.listAll(account_id, active)

    return { users }
  }
}
