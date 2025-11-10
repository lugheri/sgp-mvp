import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { SystemModuleUseCaseFactory } from '../usecases/factories/system-module-usecases.factory'
import { SystemModulePartialDTO } from '../@dtos/SystemModuleDTO'
export const updateSystemModule = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      system_module_id: z.coerce.number(),
    })
    const { system_module_id } = params.parse(request.params)
    const system_module_data = SystemModulePartialDTO.parse(request.body)

    const { systemModuleUpdated } =
      await SystemModuleUseCaseFactory.updateSystemModule().execute({
        system_module_id,
        system_module_data,
      })
    reply.status(200).send(systemModuleUpdated)
  } catch (err) {
    console.log(err)
    throw err
  }
}
