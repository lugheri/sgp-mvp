import userInfoRoute from '@/_modules/users/routes/user-info.route'
import usersRoute from '@/_modules/users/routes/users.route'
import { FastifyInstance } from 'fastify'

export const serviceRoutes = async (app: FastifyInstance) => {
  usersRoute(app)
  userInfoRoute(app)
}
