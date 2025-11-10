import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { UserInfoUseCaseFactory } from '../../usecases/factories/user-info-usecases.factory'

export const getUserInfo = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ userinfo_id: z.coerce.number() })
    const { userinfo_id } = params.parse(request.params)
    const { userinfo } = await UserInfoUseCaseFactory.getUserInfo().execute({
      userinfo_id,
    })
    reply.status(200).send(userinfo)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404)
    }
    throw err
  }
}
