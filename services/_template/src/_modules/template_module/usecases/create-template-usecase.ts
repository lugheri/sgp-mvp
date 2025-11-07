import { TemplateType } from '../@dtos/TemplateDTO'
import { TemplateEntity } from '../entities/Template.entity'
import { TemplateAlreadyExistsError } from '../errors/template-already-exists-error'
import { ITemplateRepository } from '../repositories/interfaces/itemplate.repository'

interface Request {
  dataTemplate: TemplateType
}

interface Response {
  templateCreated: TemplateEntity
}

export class CreateTemplateUseCase {
  constructor(private templatesRepository: ITemplateRepository) {}

  async execute({ dataTemplate }: Request): Promise<Response> {
    const templateWithSameName = await this.templatesRepository.findByName(
      dataTemplate.template_name,
    )
    if (templateWithSameName) {
      throw new TemplateAlreadyExistsError()
    }
    const templateCreated = await this.templatesRepository.create(dataTemplate)
    return { templateCreated }
  }
}
