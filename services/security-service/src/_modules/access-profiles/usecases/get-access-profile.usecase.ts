import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { AccessProfileEntity } from '../entities/AccessProfile.entity'
import { IAccessProfileRepository } from '../repositories/interfaces/iaccess-profile.repository'

interface Request {
  account_id: number
  access_profile_id: number
}

interface Response {
  accessProfile: AccessProfileEntity
}

export class GetAccessProfileUseCase {
  constructor(private accessProfileRepository: IAccessProfileRepository) {}
  async execute({ account_id, access_profile_id }: Request): Promise<Response> {
    const accessProfile = await this.accessProfileRepository.get(
      account_id,
      access_profile_id,
    )
    if (!accessProfile) {
      throw new ResourceNotFoundError()
    }
    return { accessProfile }
  }
}
