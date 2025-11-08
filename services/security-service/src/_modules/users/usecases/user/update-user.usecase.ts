import { UserPartialType } from '../../@dtos/UserDTO'
import { UserEntity } from '../../entities/User.entity'
import { IUserRepository } from '../../repositories/interfaces/iuser.repository'

interface Request {
  account_id: number
  user_id: number
  user_data: UserPartialType
}
interface Response {
  userUpdated: UserEntity
}

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute({
    account_id,
    user_id,
    user_data,
  }: Request): Promise<Response> {
    const userUpdated = await this.userRepository.update(
      account_id,
      user_id,
      user_data,
    )
    return { userUpdated }
  }
}
