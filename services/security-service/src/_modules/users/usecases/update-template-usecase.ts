import { TemplatePartialType } from '../@dtos/TemplateDTO'
import { TemplateEntity } from '../entities/Template.entity'
import { ITemplateRepository } from '../repositories/interfaces/itemplate.repository'

interface Request {
  template_id: number
  template_data: TemplatePartialType
}
interface Response {
  templateUpdated: TemplateEntity
}

export class UpdateTemplateUseCase {
  constructor(private templateRepository: ITemplateRepository) {}
  async execute({ template_id, template_data }: Request): Promise<Response> {
    const templateUpdated = await this.templateRepository.update(
      template_id,
      template_data,
    )
    return { templateUpdated }
  }
}
