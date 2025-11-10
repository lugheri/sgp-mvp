import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { RoleUseCaseFactory } from '../usecases/factories/role-usecases.factory'
export const listRole = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      page: z.coerce.number(),
      active: z.coerce.number(),
      name_search: z.string(),
    })
    const { page, active, name_search } = params.parse(request.params)
    const name = name_search === 'all' ? undefined : name_search

    const roles = await RoleUseCaseFactory.listRoles().execute({
      page,
      active,
      name,
    })
    reply.status(200).send(roles)
  } catch (err) {
    console.log(err)
    throw err
  }
}
