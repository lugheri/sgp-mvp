import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { IAccessProfileRepository } from '../repositories/interfaces/iaccess-profile.repository'

interface Request {
  account_id: number
  access_profile_id: number
}

interface Response {
  removed: boolean
}

export class DeleteAccessProfileUseCase {
  constructor(private accessProfileRepository: IAccessProfileRepository) {}

  async execute({ account_id, access_profile_id }: Request): Promise<Response> {
    const checkAccessProfile = await this.accessProfileRepository.get(
      account_id,
      access_profile_id,
    )
    if (!checkAccessProfile) {
      throw new ResourceNotFoundError()
    }
    await this.accessProfileRepository.delete(account_id, access_profile_id)
    return { removed: true }
  }
}
