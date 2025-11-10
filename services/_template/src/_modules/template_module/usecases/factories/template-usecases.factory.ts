import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository'
import { PrismaTemplateRepository } from '../../repositories/implementations/prisma-template.repository'
import { CreateTemplateUseCase } from '../create-template-usecase'
import { PrismaClient } from '@prisma/client'
import { GetTemplateUseCase } from '../get-template-usecase'
import { UpdateTemplateUseCase } from '../update-template-usecase'
import { ListAllTemplatesUseCase } from '../list-all-templates-usecase'
import { ListTemplatesUseCase } from '../usecases/list-templates-usecase'
import { DeleteTemplateUseCase } from '../delete-template-usecase'

const cacheRepository = new RedisCacheRepository()
const prismaClient = new PrismaClient()
const templateRepository = new PrismaTemplateRepository(
  cacheRepository,
  prismaClient,
)
export const TemplateUseCaseFactory = {
  createTemplate: () => new CreateTemplateUseCase(templateRepository),
  getTemplate: () => new GetTemplateUseCase(templateRepository),
  updateTemplate: () => new UpdateTemplateUseCase(templateRepository),
  deleteTemplate: () => new DeleteTemplateUseCase(templateRepository),
  listTemplates: () => new ListTemplatesUseCase(templateRepository),
  listAllTemplates: () => new ListAllTemplatesUseCase(templateRepository),
}
