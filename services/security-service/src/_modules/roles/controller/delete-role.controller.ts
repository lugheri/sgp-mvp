import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { RoleUseCaseFactory } from '../factories/role-usecases.factory'
export const deleteRole = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      role_id: z.string(),
    })
    const { role_id } = params.parse(request.params)

    const { removed } = await RoleUseCaseFactory.deleteRole().execute({
      role_id,
    })
    reply.status(200).send({ removed })
  } catch (err) {
    console.log(err)
    throw err
  }
}
