import { ISystemModuleRepository } from '../repositories/interfaces/isystem-module.repository'

interface Request {
  system_module_id: number
  role_id: string
}

interface Response {
  removed: boolean
}

export class RemoveRoleSystemModuleUseCase {
  constructor(private systemModulesRepository: ISystemModuleRepository) {}

  async execute({ system_module_id, role_id }: Request): Promise<Response> {
    const removed = await this.systemModulesRepository.removeRole(
      system_module_id,
      role_id,
    )
    return { removed }
  }
}
