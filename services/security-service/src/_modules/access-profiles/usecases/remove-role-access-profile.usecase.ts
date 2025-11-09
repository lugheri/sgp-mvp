import { IAccessProfileRepository } from '../repositories/interfaces/iaccess-profile.repository'

interface Request {
  access_profile_id: number
  role_id: string
}

interface Response {
  removed: boolean
}

export class RemoveRoleAccessProfileUseCase {
  constructor(private accessProfilesRepository: IAccessProfileRepository) {}

  async execute({ access_profile_id, role_id }: Request): Promise<Response> {
    const removed = await this.accessProfilesRepository.removeRole(
      access_profile_id,
      role_id,
    )
    return { removed }
  }
}
