import { z } from 'zod'

export const UserInfoDTO = z.object({
  user_id: z.coerce.number(),
  name: z.string(),
  email: z.string(),
  number_phone: z.string(),
  is_whatsapp: z.coerce.number(),

  other_phone: z.string().optional().nullable(),
  alternative_email: z.string().optional().nullable(),
})
export type UserInfoType = z.infer<typeof UserInfoDTO>
export const UserInfoPartialDTO = UserInfoDTO.partial()
export type UserInfoPartialType = z.infer<typeof UserInfoPartialDTO>
