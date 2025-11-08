import { TemplateEntity } from '../entities/Template.entity'
import { ITemplateRepository } from '../repositories/interfaces/itemplate.repository'

interface Request {
  page: number
  active: number
  agreed: number
  name?: string
}

interface Response {
  templates: TemplateEntity[]
  meta: {
    page: number
    perPage: number
    totalCount: number
  }
}

export class ListTemplatesUseCase {
  constructor(private templateRepository: ITemplateRepository) {}
  async execute({ page, active, agreed, name }: Request): Promise<Response> {
    const templates = await this.templateRepository.list(
      page,
      active,
      agreed,
      name,
    )

    return templates
  }
}
