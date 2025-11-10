import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { TemplateUseCaseFactory } from '../usecases/factories/template-usecases.factory'
export const deleteTemplate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ template_id: z.coerce.number() })
    const { template_id } = params.parse(request.params)

    const { removed } = await TemplateUseCaseFactory.deleteTemplate().execute({
      template_id,
    })
    reply.status(200).send({ removed })
  } catch (err) {
    console.log(err)
    throw err
  }
}
