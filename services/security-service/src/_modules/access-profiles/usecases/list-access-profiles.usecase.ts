import { AccessProfileEntity } from '../entities/AccessProfile.entity'
import { IAccessProfileRepository } from '../repositories/interfaces/iaccess-profile.repository'

interface Request {
  account_id: number
  page: number
  active: number
  name?: string
}

interface Response {
  access_profiles: AccessProfileEntity[]
  meta: {
    page: number
    perPage: number
    totalCount: number
  }
}

export class ListAccessProfilesUseCase {
  constructor(private accessProfileRepository: IAccessProfileRepository) {}
  async execute({
    account_id,
    page,
    active,
    name,
  }: Request): Promise<Response> {
    const access_profiles = await this.accessProfileRepository.list(
      account_id,
      page,
      active,
      name,
    )

    return access_profiles
  }
}
