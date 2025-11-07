import templatesRoute from '@/_modules/templates/routes/templates.route'
import { FastifyInstance } from 'fastify'

export const serviceRoutes = async (app: FastifyInstance) => {
  templatesRoute(app)
}
