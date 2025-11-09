import { SystemModulePartialType } from '../@dtos/SystemModuleDTO'
import { SystemModuleEntity } from '../entities/SystemModule.entity'
import { ISystemModuleRepository } from '../repositories/interfaces/isystem-module.repository'

interface Request {
  system_module_id: number
  system_module_data: SystemModulePartialType
}
interface Response {
  systemModuleUpdated: SystemModuleEntity
}

export class UpdateSystemModuleUseCase {
  constructor(private systemModuleRepository: ISystemModuleRepository) {}
  async execute({
    system_module_id,
    system_module_data,
  }: Request): Promise<Response> {
    const systemModuleUpdated = await this.systemModuleRepository.update(
      system_module_id,
      system_module_data,
    )
    return { systemModuleUpdated }
  }
}
