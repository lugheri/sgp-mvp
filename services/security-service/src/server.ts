import fastify from 'fastify'

import cors from '@fastify/cors'
import { ZodError } from 'zod'
import { env } from './env'
import { serviceRoutes } from './http/routes/routes'

export const app = fastify()

app.register(cors, {
  // CORS Setup
  origin: '*', // Permitir solicitações de qualquer origem (ou especifique a origem desejada)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  credentials: true, // Permitir credenciais (cookies, cabeçalhos de autorização, etc.)
})

app.register(serviceRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.issues })
  }

  if (env.ENVIRONMENT !== 'production') {
    console.error(error)
  } else {
    // Log external tool
  }
  return reply.status(500).send({ message: 'Internal server error.' })
})

app
  .listen({
    host: '0.0.0.0',
    port: env.SERVICE_PORT,
  })
  .then(() => {
    console.log(
      `SGP [security-service] 🚀 Running at port  ${env.SERVICE_PORT}`,
    )
  })
  .catch((err) => {
    console.error('SGP [security-service] ❌ Failed to start:', err)
    process.exit(1)
  })
