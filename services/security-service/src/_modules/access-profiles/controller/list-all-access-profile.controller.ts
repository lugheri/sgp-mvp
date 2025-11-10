import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { AccessProfileUseCaseFactory } from '../usecases/factories/access-profile-usecases.factory'
export const listAllAccessProfiles = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      account_id: z.coerce.number(),
      active: z.coerce.number().default(1),
    })
    const { account_id, active } = params.parse(request.params)

    const access_profiles =
      await AccessProfileUseCaseFactory.listAllAccessProfiles().execute({
        account_id,
        active,
      })
    reply.status(200).send(access_profiles)
  } catch (err) {
    console.log(err)
    throw err
  }
}
