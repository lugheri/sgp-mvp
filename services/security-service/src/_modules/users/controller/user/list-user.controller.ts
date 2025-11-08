import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserUseCaseFactory } from '../../factories/user-usecases.factory'
export const listUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      account_id: z.coerce.number(),
      page: z.coerce.number(),
      active: z.coerce.number(),
      username_search: z.string(),
    })
    const { account_id, page, active, username_search } = params.parse(
      request.params,
    )
    const username = username_search === 'all' ? undefined : username_search

    const users = await UserUseCaseFactory.listUsers().execute({
      account_id,
      page,
      active,
      username,
    })
    reply.status(200).send(users)
  } catch (err) {
    console.log(err)
    throw err
  }
}
