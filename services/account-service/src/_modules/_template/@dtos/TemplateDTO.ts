import { z } from 'zod'

export const TemplateDTO = z.object({
  template_owner: z.number(),
  template_name: z.string(),
  company_name: z.string(),
  terms_agreed: z.number(),
  public_ip: z.string().optional().default(''),
  local_ip: z.string().optional().default(''),
  setup_environment: z.number().optional().default(0),
  active: z.number(),
})
export type TemplateType = z.infer<typeof TemplateDTO>
export const TemplatePartialDTO = TemplateDTO.partial()
export type TemplatePartialType = z.infer<typeof TemplatePartialDTO>
