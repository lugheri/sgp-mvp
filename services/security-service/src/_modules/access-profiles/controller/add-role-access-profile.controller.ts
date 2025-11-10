import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { AccessProfileUseCaseFactory } from '../usecases/factories/access-profile-usecases.factory'

export const addRoleAccessProfile = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      access_profile_id: z.coerce.number(),
      role_id: z.string(),
    })
    const { access_profile_id, role_id } = params.parse(request.body)
    const { added } =
      await AccessProfileUseCaseFactory.addRoleAccessProfileUseCase().execute({
        access_profile_id,
        role_id,
      })
    reply.status(200).send(added)
  } catch (err) {
    console.log(err)
    throw err
  }
}
