import accessProfileRoute from '@/_modules/access-profiles/routes/access-profile.route'
import rolesRoute from '@/_modules/roles/routes/roles.route'
import systemModuleRoute from '@/_modules/system-modules/routes/system-module.route'
import userInfoRoute from '@/_modules/users/routes/user-info.route'
import usersRoute from '@/_modules/users/routes/users.route'
import { FastifyInstance } from 'fastify'

export const serviceRoutes = async (app: FastifyInstance) => {
  // USERS
  usersRoute(app)
  userInfoRoute(app)

  // ACCESS PROFILE
  accessProfileRoute(app)

  // ROLES
  rolesRoute(app)

  // SYSTEM MODULES
  systemModuleRoute(app)
}
