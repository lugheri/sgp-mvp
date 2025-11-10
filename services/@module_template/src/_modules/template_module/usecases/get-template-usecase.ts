import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { TemplateEntity } from '../entities/Template.entity'
import { ITemplateRepository } from '../repositories/interfaces/itemplate.repository'

interface Request {
  template_id: number
}

interface Response {
  template: TemplateEntity
}

export class GetTemplateUseCase {
  constructor(private templateRepository: ITemplateRepository) {}
  async execute({ template_id }: Request): Promise<Response> {
    const template = await this.templateRepository.get(template_id)
    if (!template) {
      throw new ResourceNotFoundError()
    }
    return { template }
  }
}
