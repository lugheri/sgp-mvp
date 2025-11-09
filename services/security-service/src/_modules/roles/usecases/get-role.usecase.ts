import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { RoleEntity } from '../entities/Role.entity'
import { IRoleRepository } from '../repositories/interfaces/irole.repository'

interface Request {
  role_id: string
}

interface Response {
  role: RoleEntity
}

export class GetRoleUseCase {
  constructor(private roleRepository: IRoleRepository) {}
  async execute({ role_id }: Request): Promise<Response> {
    const role = await this.roleRepository.get(role_id)
    if (!role) {
      throw new ResourceNotFoundError()
    }
    return { role }
  }
}
