import { RolePartialType } from '../@dtos/RoleDTO'
import { RoleEntity } from '../entities/Role.entity'
import { IRoleRepository } from '../repositories/interfaces/irole.repository'

interface Request {
  role_id: string
  role_data: RolePartialType
}
interface Response {
  roleUpdated: RoleEntity
}

export class UpdateRoleUseCase {
  constructor(private roleRepository: IRoleRepository) {}
  async execute({ role_id, role_data }: Request): Promise<Response> {
    const roleUpdated = await this.roleRepository.update(role_id, role_data)
    return { roleUpdated }
  }
}
