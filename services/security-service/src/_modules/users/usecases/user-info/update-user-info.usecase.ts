import { Prisma } from '@prisma/client'
import { UserInfoEntity } from '../../entities/UserInfo.entity'
import { IUserInfoRepository } from '../../repositories/interfaces/iuser-info.repository'

interface Request {
  userinfo_id: number
  userinfo_data: Prisma.UserInfoUncheckedUpdateInput
}
interface Response {
  userinfoUpdated: UserInfoEntity
}

export class UpdateUserInfoUseCase {
  constructor(private userinfoRepository: IUserInfoRepository) {}
  async execute({ userinfo_id, userinfo_data }: Request): Promise<Response> {
    const userinfoUpdated = await this.userinfoRepository.update(
      userinfo_id,
      userinfo_data,
    )
    return { userinfoUpdated }
  }
}
