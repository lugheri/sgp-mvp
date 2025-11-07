import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { ITemplateRepository } from '../repositories/interfaces/itemplate.repository'

interface Request {
  template_id: number
}

interface Response {
  removed: boolean
}

export class DeleteTemplateUseCase {
  constructor(private templateRepository: ITemplateRepository) {}

  async execute({ template_id }: Request): Promise<Response> {
    const checkTemplate = await this.templateRepository.get(template_id)
    if (!checkTemplate) {
      throw new ResourceNotFoundError()
    }
    await this.templateRepository.delete(template_id)
    return { removed: true }
  }
}
