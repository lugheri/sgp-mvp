import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { SystemModuleUseCaseFactory } from '../usecases/factories/system-module-usecases.factory'
export const listAllSystemModules = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      module_owner: z.coerce.number(),
      active: z.coerce.number().default(1),
    })
    const { module_owner, active } = params.parse(request.params)

    const system_modules =
      await SystemModuleUseCaseFactory.listAllSystemModules().execute({
        module_owner,
        active,
      })
    reply.status(200).send(system_modules)
  } catch (err) {
    console.log(err)
    throw err
  }
}
