import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserInfoUseCaseFactory } from '../../factories/user-info-usecases.factory'
import { UserInfoPartialDTO } from '../../@dtos/UserInfoDTO'

export const updateUserInfo = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      userinfo_id: z.coerce.number(),
    })
    const { userinfo_id } = params.parse(request.params)
    const userinfo_data = UserInfoPartialDTO.parse(request.body)

    const { userinfoUpdated } =
      await UserInfoUseCaseFactory.updateUserInfo().execute({
        userinfo_id,
        userinfo_data,
      })
    reply.status(200).send(userinfoUpdated)
  } catch (err) {
    console.log(err)
    throw err
  }
}
