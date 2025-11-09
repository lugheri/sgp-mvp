import { ISystemModuleRepository } from '../repositories/interfaces/isystem-module.repository'

interface Request {
  system_module_id: number
  role_id: string
}

interface Response {
  added: boolean
}

export class AddRoleSystemModuleUseCase {
  constructor(private systemModulesRepository: ISystemModuleRepository) {}

  async execute({ system_module_id, role_id }: Request): Promise<Response> {
    const added = await this.systemModulesRepository.addRole(
      system_module_id,
      role_id,
    )
    return { added }
  }
}
