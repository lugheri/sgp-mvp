import { FastifyReply, FastifyRequest } from 'fastify'
import { AccessProfileDTO } from '../@dtos/AccessProfileDTO'
import { AccessProfileUseCaseFactory } from '../usecases/factories/access-profile-usecases.factory'
import { AccessProfileAlreadyExistsError } from '../errors/access-profile-already-exists-error'

export const createAccessProfile = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const dataAccessProfile = AccessProfileDTO.parse(request.body)
    const { accessProfileCreated } =
      await AccessProfileUseCaseFactory.createAccessProfile().execute({
        dataAccessProfile,
      })

    reply.status(201).send(accessProfileCreated)
  } catch (err) {
    if (err instanceof AccessProfileAlreadyExistsError) {
      return reply.status(409).send({ error: true, message: err.message })
    }
    throw err
  }
}
