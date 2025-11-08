import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { UserInfoEntity } from '../../entities/UserInfo.entity'
import { IUserInfoRepository } from '../../repositories/interfaces/iuser-info.repository'

interface Request {
  userinfo_id: number
}

interface Response {
  userinfo: UserInfoEntity
}

export class GetUserInfoUseCase {
  constructor(private userinfoRepository: IUserInfoRepository) {}
  async execute({ userinfo_id }: Request): Promise<Response> {
    const userinfo = await this.userinfoRepository.get(userinfo_id)
    if (!userinfo) {
      throw new ResourceNotFoundError()
    }
    return { userinfo }
  }
}
