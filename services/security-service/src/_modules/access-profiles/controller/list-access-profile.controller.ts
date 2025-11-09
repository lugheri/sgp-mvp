import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { AccessProfileUseCaseFactory } from '../factories/access-profile-usecases.factory'
export const listAccessProfile = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      account_id: z.coerce.number(),
      page: z.coerce.number(),
      active: z.coerce.number(),
      name_search: z.string(),
    })
    const { account_id, page, active, name_search } = params.parse(
      request.params,
    )
    const name = name_search === 'all' ? undefined : name_search

    const access_profiles =
      await AccessProfileUseCaseFactory.listAccessProfiles().execute({
        account_id,
        page,
        active,
        name,
      })
    reply.status(200).send(access_profiles)
  } catch (err) {
    console.log(err)
    throw err
  }
}
