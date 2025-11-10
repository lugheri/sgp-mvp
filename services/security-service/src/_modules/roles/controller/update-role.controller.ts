import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { RoleUseCaseFactory } from '../usecases/factories/role-usecases.factory'
import { RolePartialDTO } from '../@dtos/RoleDTO'
export const updateRole = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      role_id: z.string(),
    })
    const { role_id } = params.parse(request.params)
    const role_data = RolePartialDTO.parse(request.body)

    const { roleUpdated } = await RoleUseCaseFactory.updateRole().execute({
      role_id,
      role_data,
    })
    reply.status(200).send(roleUpdated)
  } catch (err) {
    console.log(err)
    throw err
  }
}
