import { z } from 'zod'

export const RoleDTO = z.object({
  name: z.string(),
  description: z.string(),
  active: z.coerce.number(),
})
export type RoleType = z.infer<typeof RoleDTO>
export const RolePartialDTO = RoleDTO.partial()
export type RolePartialType = z.infer<typeof RolePartialDTO>
