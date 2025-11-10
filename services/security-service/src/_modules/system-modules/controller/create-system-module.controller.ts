import { FastifyReply, FastifyRequest } from 'fastify'
import { SystemModuleDTO } from '../@dtos/SystemModuleDTO'
import { SystemModuleUseCaseFactory } from '../usecases/factories/system-module-usecases.factory'
import { SystemModuleAlreadyExistsError } from '../errors/system-module-already-exists-error'

export const createSystemModule = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const dataSystemModule = SystemModuleDTO.parse(request.body)
    const { systemModuleCreated } =
      await SystemModuleUseCaseFactory.createSystemModule().execute({
        dataSystemModule,
      })

    reply.status(201).send(systemModuleCreated)
  } catch (err) {
    if (err instanceof SystemModuleAlreadyExistsError) {
      return reply.status(409).send({ error: true, message: err.message })
    }
    throw err
  }
}
