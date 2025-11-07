import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { AccountPartialDTO } from '../@dtos/AccountDTO'
import { AccountUseCaseFactory } from '../factories/account-usecases.factory'
export const updateAccount = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ account_id: z.coerce.number() })
    const { account_id } = params.parse(request.params)
    const account_data = AccountPartialDTO.parse(request.body)

    const { accountUpdated } =
      await AccountUseCaseFactory.updateAccount().execute({
        account_id,
        account_data,
      })
    reply.status(200).send(accountUpdated)
  } catch (err) {
    console.log(err)
    throw err
  }
}
