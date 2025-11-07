import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  ENVIRONMENT: z
    .enum(['development', 'test', 'production'])
    .default('production'),
  SERVICE_PORT: z.coerce.number().default(10001),
})
const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables!', _env.error.issues)
  throw new Error('Invalid environmnent variables')
}

export const env = _env.data
