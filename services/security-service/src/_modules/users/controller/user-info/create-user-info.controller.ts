import { FastifyReply, FastifyRequest } from 'fastify'
import { UserInfoDTO } from '../../@dtos/UserInfoDTO'
import { UserInfoUseCaseFactory } from '../../usecases/factories/user-info-usecases.factory'

export const createUserInfo = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const dataUserInfo = UserInfoDTO.parse(request.body)
    const { userinfoCreated } =
      await UserInfoUseCaseFactory.createUserInfo().execute({ dataUserInfo })

    reply.status(201).send(userinfoCreated)
  } catch (err) {
    console.log(err)
    throw err
  }
}
