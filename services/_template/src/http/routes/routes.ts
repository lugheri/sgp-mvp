
import { routesTemplate } from '@/_modules/template_module/routes/route-template.route'
import { FastifyInstance, FastifyReply } from 'fastify'

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RoutesServices {
  method: 'post' | 'get' | 'put' | 'delete'
  path: string
  handler: any
}

export const serviceRoutes = async (app: FastifyInstance) => {
  routesTemplate(app)
}
