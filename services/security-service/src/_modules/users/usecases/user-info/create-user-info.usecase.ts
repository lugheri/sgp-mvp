import { UserInfoType } from '../../@dtos/UserInfoDTO'
import { UserInfoEntity } from '../../entities/UserInfo.entity'
import { IUserInfoRepository } from '../../repositories/interfaces/iuser-info.repository'

interface Request {
  dataUserInfo: UserInfoType
}

interface Response {
  userinfoCreated: UserInfoEntity
}

export class CreateUserInfoUseCase {
  constructor(private userinfoRepository: IUserInfoRepository) {}

  async execute({ dataUserInfo }: Request): Promise<Response> {
    const userinfoCreated = await this.userinfoRepository.create(dataUserInfo)
    return { userinfoCreated }
  }
}
