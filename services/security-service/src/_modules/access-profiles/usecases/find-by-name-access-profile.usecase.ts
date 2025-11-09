import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { AccessProfileEntity } from '../entities/AccessProfile.entity'
import { IAccessProfileRepository } from '../repositories/interfaces/iaccess-profile.repository'

interface Request {
  account_id: number
  name: string
}

interface Response {
  access_profile: AccessProfileEntity
}

export class FindByAccessProfileUserUseCase {
  constructor(private accessProfileRepository: IAccessProfileRepository) {}
  async execute({ account_id, name }: Request): Promise<Response> {
    const access_profile = await this.accessProfileRepository.findByName(
      account_id,
      name,
    )
    if (!access_profile) {
      throw new ResourceNotFoundError()
    }
    return { access_profile }
  }
}
