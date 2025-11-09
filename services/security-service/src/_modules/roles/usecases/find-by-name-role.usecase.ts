import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { RoleEntity } from '../entities/Role.entity'
import { IRoleRepository } from '../repositories/interfaces/irole.repository'

interface Request {
  name: string
}

interface Response {
  role: RoleEntity
}

export class FindByNameRoleUseCase {
  constructor(private roleRepository: IRoleRepository) {}
  async execute({ name }: Request): Promise<Response> {
    const role = await this.roleRepository.findByName(name)
    if (!role) {
      throw new ResourceNotFoundError()
    }
    return { role }
  }
}
