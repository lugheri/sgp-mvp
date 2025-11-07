import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { TemplateUseCaseFactory } from '../factories/template-usecases.factory'
export const listAllTemplates = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      active: z.coerce.number().default(1),
      agreed: z.coerce.number().default(1),
    })
    const { active, agreed } = params.parse(request.params)

    const templates = await TemplateUseCaseFactory.listAllTemplates().execute({
      active,
      agreed,
    })
    reply.status(200).send(templates)
  } catch (err) {
    console.log(err)
    throw err
  }
}
