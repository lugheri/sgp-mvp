import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { SystemModuleEntity } from '../entities/SystemModule.entity'
import { ISystemModuleRepository } from '../repositories/interfaces/isystem-module.repository'

interface Request {
  system_module_id: number
}

interface Response {
  systemModule: SystemModuleEntity
}

export class GetSystemModuleUseCase {
  constructor(private systemModuleRepository: ISystemModuleRepository) {}
  async execute({ system_module_id }: Request): Promise<Response> {
    const systemModule = await this.systemModuleRepository.get(system_module_id)
    if (!systemModule) {
      throw new ResourceNotFoundError()
    }
    return { systemModule }
  }
}
