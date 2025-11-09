import {
  SystemModuleWithRoles,
  ISystemModuleRepository,
} from '../repositories/interfaces/isystem-module.repository'

interface Request {
  system_module_id: number
}

interface Response {
  rolesSystemModule: SystemModuleWithRoles | null
}

export class ListRolesSystemModuleUseCase {
  constructor(private systemModulesRepository: ISystemModuleRepository) {}

  async execute({ system_module_id }: Request): Promise<Response> {
    const rolesSystemModule =
      await this.systemModulesRepository.listRolesSystemModule(system_module_id)
    return { rolesSystemModule }
  }
}
