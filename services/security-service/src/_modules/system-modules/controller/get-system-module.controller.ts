import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { SystemModuleUseCaseFactory } from '../usecases/factories/system-module-usecases.factory'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export const getSystemModule = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      system_module_id: z.coerce.number(),
    })
    const { system_module_id } = params.parse(request.params)
    const { systemModule } =
      await SystemModuleUseCaseFactory.getSystemModule().execute({
        system_module_id,
      })
    reply.status(200).send(systemModule)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404)
    }
    throw err
  }
}
