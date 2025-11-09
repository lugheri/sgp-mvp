import { RoleEntity } from '../entities/Role.entity'
import { IRoleRepository } from '../repositories/interfaces/irole.repository'

interface Request {
  page: number
  active: number
  name?: string
}

interface Response {
  roles: RoleEntity[]
  meta: {
    page: number
    perPage: number
    totalCount: number
  }
}

export class ListRolesUseCase {
  constructor(private roleRepository: IRoleRepository) {}
  async execute({ page, active, name }: Request): Promise<Response> {
    const roles = await this.roleRepository.list(page, active, name)

    return roles
  }
}
