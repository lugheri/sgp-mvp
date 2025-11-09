import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { AccessProfileUseCaseFactory } from '../factories/access-profile-usecases.factory'

export const removeRoleAccessProfile = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      access_profile_id: z.coerce.number(),
      role_id: z.string(),
    })
    const { access_profile_id, role_id } = params.parse(request.params)
    const { removed } =
      await AccessProfileUseCaseFactory.removeRoleAccessProfileUseCase().execute(
        {
          access_profile_id,
          role_id,
        },
      )
    reply.status(200).send(removed)
  } catch (err) {
    console.log(err)
    throw err
  }
}
