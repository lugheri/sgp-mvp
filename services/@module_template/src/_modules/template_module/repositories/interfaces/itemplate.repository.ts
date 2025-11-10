import { Prisma } from '@prisma/client'
import { TemplateEntity } from '../../entities/Template.entity'

export interface ITemplateRepository {
  create(data: Prisma.TemplateUncheckedCreateInput): Promise<TemplateEntity>
  get(id: number): Promise<TemplateEntity | null>
  list(
    page: number,
    active: number,
    agreed: number,
    name?: string,
  ): Promise<{
    templates: TemplateEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }>
  update(
    id: number,
    data: Prisma.TemplateUncheckedUpdateInput,
  ): Promise<TemplateEntity>
  delete(id: number): Promise<boolean>

  listAll(active: number, agreed: number): Promise<TemplateEntity[]>
  findByName(name: string): Promise<TemplateEntity | null>
}
