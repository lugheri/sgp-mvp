import { FastifyReply, FastifyRequest } from 'fastify'
import { RoleDTO } from '../@dtos/RoleDTO'
import { RoleUseCaseFactory } from '../factories/role-usecases.factory'
import { RoleAlreadyExistsError } from '../errors/role-already-exists-error'

export const createRole = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const dataRole = RoleDTO.parse(request.body)
    const { roleCreated } = await RoleUseCaseFactory.createRole().execute({
      dataRole,
    })

    reply.status(201).send(roleCreated)
  } catch (err) {
    if (err instanceof RoleAlreadyExistsError) {
      return reply.status(409).send({ error: true, message: err.message })
    }
    throw err
  }
}
