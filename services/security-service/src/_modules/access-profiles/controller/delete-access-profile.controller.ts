import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { AccessProfileUseCaseFactory } from '../factories/access-profile-usecases.factory'
export const deleteAccessProfile = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      account_id: z.coerce.number(),
      access_profile_id: z.coerce.number(),
    })
    const { account_id, access_profile_id } = params.parse(request.params)

    const { removed } =
      await AccessProfileUseCaseFactory.deleteAccessProfile().execute({
        account_id,
        access_profile_id,
      })
    reply.status(200).send({ removed })
  } catch (err) {
    console.log(err)
    throw err
  }
}
