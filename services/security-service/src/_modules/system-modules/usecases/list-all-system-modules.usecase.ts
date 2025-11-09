import { SystemModuleEntity } from '../entities/SystemModule.entity'
import { ISystemModuleRepository } from '../repositories/interfaces/isystem-module.repository'

interface Request {
  module_owner: number
  active: number
}

interface Response {
  system_modules: SystemModuleEntity[]
}

export class ListAllSystemModulesUseCase {
  constructor(private systemModuleRepository: ISystemModuleRepository) {}
  async execute({ module_owner, active }: Request): Promise<Response> {
    const system_modules = await this.systemModuleRepository.listAll(
      module_owner,
      active,
    )

    return { system_modules }
  }
}
