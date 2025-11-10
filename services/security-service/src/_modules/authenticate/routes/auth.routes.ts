/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyInstance } from 'fastify'

export const routeAuth: {
  method: 'post' | 'get' | 'put' | 'delete'
  path: string
  handler: any
}[] = []

export default async (app: FastifyInstance) => {
  for (const route of routeAuth) {
    app[route.method](route.path, route.handler)
  }
}
