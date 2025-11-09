import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { RoleUseCaseFactory } from '../factories/role-usecases.factory'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export const getRole = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const params = z.object({
      role_id: z.string(),
    })
    const { role_id } = params.parse(request.params)
    const { role } = await RoleUseCaseFactory.getRole().execute({
      role_id,
    })
    reply.status(200).send(role)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404)
    }
    throw err
  }
}
