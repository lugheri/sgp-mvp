import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { TemplateUseCaseFactory } from '../usecases/factories/template-usecases.factory'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export const getTemplate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ template_id: z.coerce.number() })
    const { template_id } = params.parse(request.params)
    const { template } = await TemplateUseCaseFactory.getTemplate().execute({
      template_id,
    })
    reply.status(200).send(template)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404)
    }
    throw err
  }
}
