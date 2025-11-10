import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserUseCaseFactory } from '../../usecases/factories/user-usecases.factory'
import { UserPartialDTO } from '../../@dtos/UserDTO'
export const updateUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      account_id: z.coerce.number(),
      user_id: z.coerce.number(),
    })
    const { account_id, user_id } = params.parse(request.params)
    const user_data = UserPartialDTO.parse(request.body)

    const { userUpdated } = await UserUseCaseFactory.updateUser().execute({
      account_id,
      user_id,
      user_data,
    })
    reply.status(200).send(userUpdated)
  } catch (err) {
    console.log(err)
    throw err
  }
}
