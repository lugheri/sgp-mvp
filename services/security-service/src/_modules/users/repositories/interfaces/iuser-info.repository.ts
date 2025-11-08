import { Prisma } from '@prisma/client'
import { UserInfoEntity } from '../../entities/UserInfo.entity'

export interface IUserInfoRepository {
  create(data: Prisma.UserInfoUncheckedCreateInput): Promise<UserInfoEntity>
  get(id: number): Promise<UserInfoEntity | null>
  findByUserId(user_id: number): Promise<UserInfoEntity | null>
  update(
    id: number,
    data: Prisma.UserUncheckedUpdateInput,
  ): Promise<UserInfoEntity>
}
