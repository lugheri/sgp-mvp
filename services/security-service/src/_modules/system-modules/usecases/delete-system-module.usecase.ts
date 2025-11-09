import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { ISystemModuleRepository } from '../repositories/interfaces/isystem-module.repository'

interface Request {
  system_module_id: number
}

interface Response {
  removed: boolean
}

export class DeleteSystemModuleUseCase {
  constructor(private systemModuleRepository: ISystemModuleRepository) {}

  async execute({ system_module_id }: Request): Promise<Response> {
    const checkSystemModule =
      await this.systemModuleRepository.get(system_module_id)
    if (!checkSystemModule) {
      throw new ResourceNotFoundError()
    }
    await this.systemModuleRepository.delete(system_module_id)
    return { removed: true }
  }
}
