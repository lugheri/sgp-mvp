import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { AccountUseCaseFactory } from '../factories/account-usecases.factory'
export const listAllAccounts = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      active: z.coerce.number().default(1),
      agreed: z.coerce.number().default(1),
    })
    const { active, agreed } = params.parse(request.params)

    const accounts = await AccountUseCaseFactory.listAllAccounts().execute({
      active,
      agreed,
    })
    reply.status(200).send(accounts)
  } catch (err) {
    console.log(err)
    throw err
  }
}
