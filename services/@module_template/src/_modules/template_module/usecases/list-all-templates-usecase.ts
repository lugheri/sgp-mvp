import { TemplateEntity } from '../entities/Template.entity'
import { ITemplateRepository } from '../repositories/interfaces/itemplate.repository'

interface Request {
  active: number
  agreed: number
}

interface Response {
  templates: TemplateEntity[]
}

export class ListAllTemplatesUseCase {
  constructor(private templateRepository: ITemplateRepository) {}
  async execute({ active, agreed }: Request): Promise<Response> {
    const templates = await this.templateRepository.listAll(active, agreed)

    return { templates }
  }
}
