import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { AccountUseCaseFactory } from '../usecases/factories/account-usecases.factory'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export const getAccount = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ account_id: z.coerce.number() })
    const { account_id } = params.parse(request.params)
    const { account } = await AccountUseCaseFactory.getAccount().execute({
      account_id,
    })
    reply.status(200).send(account)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404)
    }
    throw err
  }
}
