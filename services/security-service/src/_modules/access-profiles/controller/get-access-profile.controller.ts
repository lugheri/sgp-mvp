import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { AccessProfileUseCaseFactory } from '../factories/access-profile-usecases.factory'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export const getAccessProfile = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      account_id: z.coerce.number(),
      access_profile_id: z.coerce.number(),
    })
    const { account_id, access_profile_id } = params.parse(request.params)
    const { accessProfile } =
      await AccessProfileUseCaseFactory.getAccessProfile().execute({
        account_id,
        access_profile_id,
      })
    reply.status(200).send(accessProfile)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404)
    }
    throw err
  }
}
