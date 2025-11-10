import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { AccountUseCaseFactory } from '../usecases/factories/account-usecases.factory'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export const findByName = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ name: z.string() })
    const { name } = params.parse(request.params)
    const { account } = await AccountUseCaseFactory.findByName().execute({
      name,
    })
    reply.status(200).send(account)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404)
    }
    throw err
  }
}
