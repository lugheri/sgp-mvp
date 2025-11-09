import { SystemModuleEntity } from '../entities/SystemModule.entity'
import { ISystemModuleRepository } from '../repositories/interfaces/isystem-module.repository'

interface Request {
  page: number
  active: number
  module_owner: number
  name?: string
  alias?: string
}

interface Response {
  system_modules: SystemModuleEntity[]
  meta: {
    page: number
    perPage: number
    totalCount: number
  }
}

export class ListSystemModulesUseCase {
  constructor(private systemModuleRepository: ISystemModuleRepository) {}
  async execute({
    page,
    active,
    module_owner,
    name,
    alias,
  }: Request): Promise<Response> {
    const access_profiles = await this.systemModuleRepository.list(
      page,
      active,
      module_owner,
      name,
      alias,
    )

    return access_profiles
  }
}
