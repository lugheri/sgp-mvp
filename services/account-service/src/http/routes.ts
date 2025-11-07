import accountsRoute from '@/_modules/accounts/routes/accounts.route'
import { FastifyInstance } from 'fastify'

export const serviceRoutes = async (app: FastifyInstance) => {
  accountsRoute(app)
}
