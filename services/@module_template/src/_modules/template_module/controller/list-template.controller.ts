import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { TemplateUseCaseFactory } from '../usecases/factories/template-usecases.factory'
export const listTemplate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      page: z.coerce.number(),
      active: z.coerce.number(),
      agreed: z.coerce.number(),
      name_search: z.string(),
    })
    const { page, active, agreed, name_search } = params.parse(request.params)
    const name = name_search === 'all' ? undefined : name_search

    const templates = await TemplateUseCaseFactory.listTemplates().execute({
      page,
      active,
      agreed,
      name,
    })
    reply.status(200).send(templates)
  } catch (err) {
    console.log(err)
    throw err
  }
}
