import { z } from 'zod'

export const AccessProfileDTO = z.object({
  account_id: z.coerce.number(),
  name: z.string(),
  description: z.string(),
  active: z.coerce.number(),
})
export type AccessProfileType = z.infer<typeof AccessProfileDTO>
export const AccessProfilePartialDTO = AccessProfileDTO.partial()
export type AccessProfilePartialType = z.infer<typeof AccessProfilePartialDTO>
