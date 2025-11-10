import accountsRoute from '@/_modules/accounts/routes/accounts.route'
import { FastifyInstance } from 'fastify'
import authMiddleware from './middlewares/auth'
import { checkLive } from '@/_modules/accounts/controller/check-service.controller'

export const serviceRoutes = async (app: FastifyInstance) => {
  app.get('/checkLiveAccount', checkLive)
  app.register(async (protectedRoutes) => {
    protectedRoutes.addHook('onRequest', authMiddleware)
    accountsRoute(protectedRoutes)
  })
}
