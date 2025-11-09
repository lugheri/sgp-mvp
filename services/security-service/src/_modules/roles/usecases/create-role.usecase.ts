import { RoleType } from '../@dtos/RoleDTO'
import { RoleEntity } from '../entities/Role.entity'
import { RoleAlreadyExistsError } from '../errors/role-already-exists-error'
import { IRoleRepository } from '../repositories/interfaces/irole.repository'

interface Request {
  dataRole: RoleType
}

interface Response {
  roleCreated: RoleEntity
}

export class CreateRoleUseCase {
  constructor(private rolesRepository: IRoleRepository) {}

  async execute({ dataRole }: Request): Promise<Response> {
    const roleWithSameName = await this.rolesRepository.findByName(
      dataRole.name,
    )
    if (roleWithSameName) {
      throw new RoleAlreadyExistsError()
    }
    const roleCreated = await this.rolesRepository.create(dataRole)
    return { roleCreated }
  }
}
