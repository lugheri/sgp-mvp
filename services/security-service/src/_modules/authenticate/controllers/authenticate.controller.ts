/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { AuthUseCaseFactory } from '../usecase/factories/auth-usecases.factory'

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      username: z.string(),
      password: z.string().min(6),
    })
    const { username, password } = params.parse(request.body)
    const [_user, tenant] = username.split('@')

    console.log(password, _user, tenant)

    const { accountCreated } =
      await AuthUseCaseFactory.findAccountByName().execute({
        name: tenant,
      })

    // reply.send({ token, userdata })
    reply.send(accountCreated)
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: error.message })
    }
    if (error.response) {
      reply.status(400).send({ message: error.response.data.message })
    } else {
      reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  }
}
