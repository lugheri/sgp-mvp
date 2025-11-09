import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { SystemModuleUseCaseFactory } from '../factories/system-module-usecases.factory'

export const addRoleSystemModule = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      system_module_id: z.coerce.number(),
      role_id: z.string(),
    })
    const { system_module_id, role_id } = params.parse(request.body)
    const { added } =
      await SystemModuleUseCaseFactory.addRoleSystemModuleUseCase().execute({
        system_module_id,
        role_id,
      })
    reply.status(200).send(added)
  } catch (err) {
    console.log(err)
    throw err
  }
}
