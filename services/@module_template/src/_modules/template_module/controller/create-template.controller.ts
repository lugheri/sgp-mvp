import { FastifyReply, FastifyRequest } from 'fastify'
import { TemplateDTO } from '../@dtos/TemplateDTO'
import { TemplateUseCaseFactory } from '../usecases/factories/template-usecases.factory'
import { TemplateAlreadyExistsError } from '../errors/template-already-exists-error'

export const createTemplate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const dataTemplate = TemplateDTO.parse(request.body)
    const { templateCreated } =
      await TemplateUseCaseFactory.createTemplate().execute({ dataTemplate })

    reply.status(201).send(templateCreated)
  } catch (err) {
    if (err instanceof TemplateAlreadyExistsError) {
      return reply.status(409).send({ error: true, message: err.message })
    }
    throw err
  }
}
