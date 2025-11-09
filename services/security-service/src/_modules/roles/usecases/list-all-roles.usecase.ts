import { RoleEntity } from '../entities/Role.entity'
import { IRoleRepository } from '../repositories/interfaces/irole.repository'

interface Request {
  active: number
}

interface Response {
  roles: RoleEntity[]
}

export class ListAllRolesUseCase {
  constructor(private roleRepository: IRoleRepository) {}
  async execute({ active }: Request): Promise<Response> {
    const roles = await this.roleRepository.listAll(active)

    return { roles }
  }
}
