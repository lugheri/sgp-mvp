import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { IRoleRepository } from '../repositories/interfaces/irole.repository'

interface Request {
  role_id: string
}

interface Response {
  removed: boolean
}

export class DeleteRoleUseCase {
  constructor(private roleRepository: IRoleRepository) {}

  async execute({ role_id }: Request): Promise<Response> {
    const checkRole = await this.roleRepository.get(role_id)
    if (!checkRole) {
      throw new ResourceNotFoundError()
    }
    await this.roleRepository.delete(role_id)
    return { removed: true }
  }
}
