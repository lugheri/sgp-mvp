import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { RoleUseCaseFactory } from '../factories/role-usecases.factory'
export const listAllRoles = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      active: z.coerce.number().default(1),
    })
    const { active } = params.parse(request.params)

    const roles = await RoleUseCaseFactory.listAllRoles().execute({
      active,
    })
    reply.status(200).send(roles)
  } catch (err) {
    console.log(err)
    throw err
  }
}
