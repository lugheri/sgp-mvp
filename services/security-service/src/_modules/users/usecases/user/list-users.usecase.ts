import { UserEntity } from '../../entities/User.entity'
import { IUserRepository } from '../../repositories/interfaces/iuser.repository'

interface Request {
  account_id: number
  page: number
  active: number
  username?: string
}

interface Response {
  users: UserEntity[]
  meta: {
    page: number
    perPage: number
    totalCount: number
  }
}

export class ListUsersUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute({
    account_id,
    page,
    active,
    username,
  }: Request): Promise<Response> {
    const users = await this.userRepository.list(
      account_id,
      page,
      active,
      username,
    )

    return users
  }
}
