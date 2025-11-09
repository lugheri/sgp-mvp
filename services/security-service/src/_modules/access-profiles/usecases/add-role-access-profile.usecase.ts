import { IAccessProfileRepository } from '../repositories/interfaces/iaccess-profile.repository'

interface Request {
  access_profile_id: number
  role_id: string
}

interface Response {
  added: boolean
}

export class AddRoleAccessProfileUseCase {
  constructor(private accessProfilesRepository: IAccessProfileRepository) {}

  async execute({ access_profile_id, role_id }: Request): Promise<Response> {
    const added = await this.accessProfilesRepository.addRole(
      access_profile_id,
      role_id,
    )
    return { added }
  }
}
