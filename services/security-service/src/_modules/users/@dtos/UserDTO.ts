import { z } from 'zod'

export const UserDTO = z.object({
  account_id: z.coerce.number(),
  username: z.string(),
  password: z.string().optional().default(''),
  user_type: z.enum([
    'operational',
    'supervisor',
    'manager',
    'technical',
    'account_manager',
  ]),
  access_profile: z.number().nullable().default(null),
  reset_password: z.coerce.number(),
  active: z.coerce.number(),
})
export type UserType = z.infer<typeof UserDTO>
export const UserPartialDTO = UserDTO.partial()
export type UserPartialType = z.infer<typeof UserPartialDTO>
