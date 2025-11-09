import { z } from 'zod'

export const SystemModuleDTO = z.object({
  module_owner: z.coerce.number(),
  name: z.string(),
  alias: z.string(),
  icon: z.string().optional().default(''),
  description: z.string().optional().default(''),
  type_module: z.string(),
  order: z.coerce.number().optional().default(0),
  active: z.coerce.number(),
})
export type SystemModuleType = z.infer<typeof SystemModuleDTO>
export const SystemModulePartialDTO = SystemModuleDTO.partial()
export type SystemModulePartialType = z.infer<typeof SystemModulePartialDTO>
