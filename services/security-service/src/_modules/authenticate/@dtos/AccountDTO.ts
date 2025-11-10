import { z } from 'zod'

export const AccountDTO = z.object({
  account_owner: z.number(),
  account_name: z.string(),
  company_name: z.string(),
  terms_agreed: z.number(),
  public_ip: z.string().optional().default(''),
  local_ip: z.string().optional().default(''),
  setup_environment: z.number().optional().default(0),
  active: z.number(),
})
export type AccountType = z.infer<typeof AccountDTO>
export const AccountPartialDTO = AccountDTO.partial()
export type AccountPartialType = z.infer<typeof AccountPartialDTO>
