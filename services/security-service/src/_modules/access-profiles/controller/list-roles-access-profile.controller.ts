import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { AccessProfileUseCaseFactory } from '../usecases/factories/access-profile-usecases.factory'
export const listRolesAccessProfile = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ access_profile_id: z.coerce.number() })
    const { access_profile_id } = params.parse(request.params)

    const { rolesAccessProfile } =
      await AccessProfileUseCaseFactory.listRolesAccessProfileUseCase().execute(
        {
          access_profile_id,
        },
      )
    reply.status(200).send(rolesAccessProfile)
  } catch (err) {
    console.log(err)
    throw err
  }
}
