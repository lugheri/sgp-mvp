import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { SystemModuleUseCaseFactory } from '../usecases/factories/system-module-usecases.factory'
export const listRolesSystemModule = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ system_module_id: z.coerce.number() })
    const { system_module_id } = params.parse(request.params)

    const { rolesSystemModule } =
      await SystemModuleUseCaseFactory.listRolesSystemModuleUseCase().execute({
        system_module_id,
      })
    reply.status(200).send(rolesSystemModule)
  } catch (err) {
    console.log(err)
    throw err
  }
}
