import { AccessProfileType } from '../@dtos/AccessProfileDTO'
import { AccessProfileEntity } from '../entities/AccessProfile.entity'
import { AccessProfileAlreadyExistsError } from '../errors/access-profile-already-exists-error'
import { IAccessProfileRepository } from '../repositories/interfaces/iaccess-profile.repository'

interface Request {
  dataAccessProfile: AccessProfileType
}

interface Response {
  accessProfileCreated: AccessProfileEntity
}

export class CreateAccessProfileUseCase {
  constructor(private accessProfilesRepository: IAccessProfileRepository) {}

  async execute({ dataAccessProfile }: Request): Promise<Response> {
    const accessProfileWithSameName =
      await this.accessProfilesRepository.findByName(
        dataAccessProfile.account_id,
        dataAccessProfile.name,
      )
    if (accessProfileWithSameName) {
      throw new AccessProfileAlreadyExistsError()
    }
    const accessProfileCreated =
      await this.accessProfilesRepository.create(dataAccessProfile)
    return { accessProfileCreated }
  }
}
