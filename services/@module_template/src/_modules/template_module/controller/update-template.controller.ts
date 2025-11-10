import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { TemplatePartialDTO } from '../@dtos/TemplateDTO'
import { TemplateUseCaseFactory } from '../usecases/factories/template-usecases.factory'
export const updateTemplate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ template_id: z.coerce.number() })
    const { template_id } = params.parse(request.params)
    const template_data = TemplatePartialDTO.parse(request.body)

    const { templateUpdated } =
      await TemplateUseCaseFactory.updateTemplate().execute({
        template_id,
        template_data,
      })
    reply.status(200).send(templateUpdated)
  } catch (err) {
    console.log(err)
    throw err
  }
}
