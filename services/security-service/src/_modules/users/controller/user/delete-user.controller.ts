import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserUseCaseFactory } from '../../usecases/factories/user-usecases.factory'
export const deleteUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      account_id: z.coerce.number(),
      user_id: z.coerce.number(),
    })
    const { account_id, user_id } = params.parse(request.params)

    const { removed } = await UserUseCaseFactory.deleteUser().execute({
      account_id,
      user_id,
    })
    reply.status(200).send({ removed })
  } catch (err) {
    console.log(err)
    throw err
  }
}
