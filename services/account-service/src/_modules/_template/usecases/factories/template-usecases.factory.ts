import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository'
import { PrismaTemplateRepository } from '../repositories/implementations/prisma-template.repository'
import { CreateTemplateUseCase } from '../usecases/create-template-usecase'
import { PrismaClient } from '@prisma/client'
import { GetTemplateUseCase } from '../usecases/get-template-usecase'
import { UpdateTemplateUseCase } from '../usecases/update-template-usecase'
import { ListAllTemplatesUseCase } from '../usecases/list-all-templates-usecase'
import { ListTemplatesUseCase } from '../usecases/list-templates-usecase'
import { DeleteTemplateUseCase } from '../usecases/delete-template-usecase'

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
