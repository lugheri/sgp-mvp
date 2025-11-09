import { AccessProfileEntity } from '../entities/AccessProfile.entity'
import { IAccessProfileRepository } from '../repositories/interfaces/iaccess-profile.repository'

interface Request {
  account_id: number
  active: number
}

interface Response {
  access_profiles: AccessProfileEntity[]
}

export class ListAllAccessProfilesUseCase {
  constructor(private accessProfileRepository: IAccessProfileRepository) {}
  async execute({ account_id, active }: Request): Promise<Response> {
    const access_profiles = await this.accessProfileRepository.listAll(
      account_id,
      active,
    )

    return { access_profiles }
  }
}
