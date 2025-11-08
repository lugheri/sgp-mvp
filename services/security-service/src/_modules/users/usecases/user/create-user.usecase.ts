import { UserType } from '../../@dtos/UserDTO'
import { UserEntity } from '../../entities/User.entity'
import { UserAlreadyExistsError } from '../../errors/user-already-exists-error'
import { IUserRepository } from '../../repositories/interfaces/iuser.repository'

interface Request {
  dataUser: UserType
}

interface Response {
  userCreated: UserEntity
}

export class CreateUserUseCase {
  constructor(private usersRepository: IUserRepository) {}

  async execute({ dataUser }: Request): Promise<Response> {
    const userWithSameName = await this.usersRepository.findByUsername(
      dataUser.account_id,
      dataUser.username,
    )
    if (userWithSameName) {
      throw new UserAlreadyExistsError()
    }
    const userCreated = await this.usersRepository.create(dataUser)
    return { userCreated }
  }
}
