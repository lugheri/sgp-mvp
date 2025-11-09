import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { SystemModuleEntity } from '../entities/SystemModule.entity'
import { ISystemModuleRepository } from '../repositories/interfaces/isystem-module.repository'

interface Request {
  name: string
}

interface Response {
  system_module: SystemModuleEntity
}

export class FindBySystemModulenameSystemModuleUseCase {
  constructor(private systemModuleRepository: ISystemModuleRepository) {}
  async execute({ name }: Request): Promise<Response> {
    const system_module = await this.systemModuleRepository.findByName(name)
    if (!system_module) {
      throw new ResourceNotFoundError()
    }
    return { system_module }
  }
}
