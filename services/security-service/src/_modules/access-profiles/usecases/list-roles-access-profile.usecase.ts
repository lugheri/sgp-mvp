import {
  AccessProfileWithRoles,
  IAccessProfileRepository,
} from '../repositories/interfaces/iaccess-profile.repository'

interface Request {
  access_profile_id: number
}

interface Response {
  rolesAccessProfile: AccessProfileWithRoles | null
}

export class ListRolesAccessProfileUseCase {
  constructor(private accessProfilesRepository: IAccessProfileRepository) {}

  async execute({ access_profile_id }: Request): Promise<Response> {
    const rolesAccessProfile =
      await this.accessProfilesRepository.listRolesAccessProfile(
        access_profile_id,
      )
    return { rolesAccessProfile }
  }
}
