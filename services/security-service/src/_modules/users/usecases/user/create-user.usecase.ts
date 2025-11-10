import { UserType } from '../../@dtos/UserDTO'
import { UserEntity } from '../../entities/User.entity'
import { UserAlreadyExistsError } from '../../errors/user-already-exists-error'
import { IUserRepository } from '../../repositories/interfaces/iuser.repository'
import { hash } from 'bcryptjs'

interface Request {
  dataUser: UserType
}

interface Response {
  userCreated: UserEntity
  provisoryPass: string
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
    const length = 8
    const characters =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$&'
    let passwordHash = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      passwordHash += characters.charAt(randomIndex)
    }
    const newPassword = await hash(passwordHash, 6)

    const userCreated = await this.usersRepository.create({
      ...dataUser,
      password: newPassword,
    })
    return { userCreated, provisoryPass: passwordHash }
  }
}
