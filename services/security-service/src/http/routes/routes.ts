import accessProfileRoute from '@/_modules/access-profiles/routes/access-profile.route'
import rolesRoute from '@/_modules/roles/routes/roles.route'
import systemModuleRoute from '@/_modules/system-modules/routes/system-module.route'
import userInfoRoute from '@/_modules/users/routes/user-info.route'
import usersRoute from '@/_modules/users/routes/users.route'
import { FastifyInstance } from 'fastify'
import authMiddleware from '../middlewares/auth'
import { checkLive } from '@/_modules/users/controller/check-service.controller'
import { authenticate } from '@/_modules/authenticate/controllers/authenticate.controller'
import authRoutes from '@/_modules/authenticate/routes/auth.routes'

export const serviceRoutes = async (app: FastifyInstance) => {
  app.get('/checkLiveSecurity', checkLive)
  app.post('/authenticate', authenticate)
  app.register(async (protectedRoutes) => {
    protectedRoutes.addHook('onRequest', authMiddleware)
    // AUTH
    authRoutes(protectedRoutes)
    // USERS
    usersRoute(protectedRoutes)
    userInfoRoute(protectedRoutes)

    // ACCESS PROFILE
    accessProfileRoute(protectedRoutes)

    // ROLES
    rolesRoute(protectedRoutes)

    // SYSTEM MODULES
    systemModuleRoute(protectedRoutes)
  })
}
