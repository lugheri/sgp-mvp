/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { AuthUseCaseFactory } from '../usecase/factories/auth-usecases.factory'
import { InvalidCredentialsError } from '../errors/auth-invalid-credentials-error'
import { UserUseCaseFactory } from '@/_modules/users/usecases/factories/user-usecases.factory'
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_user, tenant] = username.split('@')

    const { dataAccount } =
      await AuthUseCaseFactory.findAccountByName().execute({
        name: tenant,
      })

    const account_id = dataAccount.id || 0
    // Check UserData
    const { user } = await UserUseCaseFactory.findByUsernameUser().execute({
      account_id,
      username,
    })
    if (!user) {
      throw new InvalidCredentialsError()
    }
    const doesPasswordMatches = await compare(password, user.password)
    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    const token = jwt.sign(
      { sign: { sub: user.id } },
      process.env.APP_SECRET as string,
      { expiresIn: '12h' },
    )

    reply.send({ token, user })
  } catch (error: any) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }
    if (error.response) {
      reply.status(400).send({ message: error.response.data.message })
    } else {
      reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  }
}
