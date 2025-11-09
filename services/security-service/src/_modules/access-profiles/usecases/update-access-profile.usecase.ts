import { AccessProfilePartialType } from '../@dtos/AccessProfileDTO'
import { AccessProfileEntity } from '../entities/AccessProfile.entity'
import { IAccessProfileRepository } from '../repositories/interfaces/iaccess-profile.repository'

interface Request {
  account_id: number
  access_profile_id: number
  access_profile_data: AccessProfilePartialType
}
interface Response {
  accessProfileUpdated: AccessProfileEntity
}

export class UpdateAccessProfileUseCase {
  constructor(private accessProfileRepository: IAccessProfileRepository) {}
  async execute({
    account_id,
    access_profile_id,
    access_profile_data,
  }: Request): Promise<Response> {
    const accessProfileUpdated = await this.accessProfileRepository.update(
      account_id,
      access_profile_id,
      access_profile_data,
    )
    return { accessProfileUpdated }
  }
}
