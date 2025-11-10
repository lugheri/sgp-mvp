import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserUseCaseFactory } from '../../usecases/factories/user-usecases.factory'
export const listAllUsers = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      account_id: z.coerce.number(),
      active: z.coerce.number().default(1),
    })
    const { account_id, active } = params.parse(request.params)

    const users = await UserUseCaseFactory.listAllUsers().execute({
      account_id,
      active,
    })
    reply.status(200).send(users)
  } catch (err) {
    console.log(err)
    throw err
  }
}
