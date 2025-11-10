import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { SystemModuleUseCaseFactory } from '../usecases/factories/system-module-usecases.factory'
export const listSystemModule = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      page: z.coerce.number(),
      module_owner: z.coerce.number().optional().default(0),
      active: z.coerce.number(),
      name_search: z.string(),
      alias_search: z.string(),
    })
    const { page, module_owner, active, name_search, alias_search } =
      params.parse(request.params)
    const name = name_search === 'all' ? undefined : name_search
    const alias = alias_search === 'all' ? undefined : alias_search

    const system_modules =
      await SystemModuleUseCaseFactory.listSystemModules().execute({
        page,
        active,
        module_owner,
        name,
        alias,
      })
    reply.status(200).send(system_modules)
  } catch (err) {
    console.log(err)
    throw err
  }
}
