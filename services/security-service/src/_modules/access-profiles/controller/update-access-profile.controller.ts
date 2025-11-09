import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { AccessProfileUseCaseFactory } from '../factories/access-profile-usecases.factory'
import { AccessProfilePartialDTO } from '../@dtos/AccessProfileDTO'
export const updateAccessProfile = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      account_id: z.coerce.number(),
      access_profile_id: z.coerce.number(),
    })
    const { account_id, access_profile_id } = params.parse(request.params)
    const access_profile_data = AccessProfilePartialDTO.parse(request.body)

    const { accessProfileUpdated } =
      await AccessProfileUseCaseFactory.updateAccessProfile().execute({
        account_id,
        access_profile_id,
        access_profile_data,
      })
    reply.status(200).send(accessProfileUpdated)
  } catch (err) {
    console.log(err)
    throw err
  }
}
