import { SystemModuleType } from '../@dtos/SystemModuleDTO'
import { SystemModuleEntity } from '../entities/SystemModule.entity'
import { SystemModuleAlreadyExistsError } from '../errors/system-module-already-exists-error'
import { ISystemModuleRepository } from '../repositories/interfaces/isystem-module.repository'

interface Request {
  dataSystemModule: SystemModuleType
}

interface Response {
  systemModuleCreated: SystemModuleEntity
}

export class CreateSystemModuleUseCase {
  constructor(private systemModulesRepository: ISystemModuleRepository) {}

  async execute({ dataSystemModule }: Request): Promise<Response> {
    const systemModuleWithSameName =
      await this.systemModulesRepository.findByName(dataSystemModule.name)
    if (systemModuleWithSameName) {
      throw new SystemModuleAlreadyExistsError()
    }
    const systemModuleCreated =
      await this.systemModulesRepository.create(dataSystemModule)
    return { systemModuleCreated }
  }
}
