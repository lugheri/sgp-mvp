import { FastifyReply, FastifyRequest } from 'fastify'
import { AccountDTO } from '../@dtos/AccountDTO'
import { AccountAlreadyExistsError } from '../errors/account-already-exists-error'
import { AccountUseCaseFactory } from '../usecases/factories/account-usecases.factory'

export const createAccount = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const dataAccount = AccountDTO.parse(request.body)
    const { accountCreated } =
      await AccountUseCaseFactory.createAccount().execute({ dataAccount })

    reply.status(201).send(accountCreated)
  } catch (err) {
    if (err instanceof AccountAlreadyExistsError) {
      return reply.status(409).send({ error: true, message: err.message })
    }
    throw err
  }
}
