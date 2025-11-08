import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { UserInfoEntity } from '../../entities/UserInfo.entity'
import { IUserInfoRepository } from '../../repositories/interfaces/iuser-info.repository'

interface Request {
  user_id: number
}

interface Response {
  userinfo: UserInfoEntity
}

export class FindByUserIdUserInfoUseCase {
  constructor(private userinfoRepository: IUserInfoRepository) {}
  async execute({ user_id }: Request): Promise<Response> {
    const userinfo = await this.userinfoRepository.findByUserId(user_id)
    if (!userinfo) {
      throw new ResourceNotFoundError()
    }
    return { userinfo }
  }
}
