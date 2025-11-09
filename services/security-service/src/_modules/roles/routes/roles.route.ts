/* eslint-disable @typescript-eslint/no-explicit-any */

import { FastifyInstance } from 'fastify'
import { listAllRoles } from '../controller/list-all-role.controller'
import { listRole } from '../controller/list-role.controller'
import { getRole } from '../controller/get-role.controller'
import { deleteRole } from '../controller/delete-role.controller'
import { createRole } from '../controller/create-role.controller'
import { updateRole } from '../controller/update-role.controller'
export const routesRoles: {
  method: 'post' | 'get' | 'put' | 'delete'
  path: string
  handler: any
}[] = [
  { method: 'post', path: '/createRole', handler: createRole },
  { method: 'get', path: '/getRole/:role_id', handler: getRole },
  {
    method: 'put',
    path: '/updateRole/:role_id',
    handler: updateRole,
  },
  {
    method: 'delete',
    path: '/deleteRole/:role_id',
    handler: deleteRole,
  },
  {
    method: 'get',
    path: '/listRoles/:page/:active/:name_search',
    handler: listRole,
  },
  {
    method: 'get',
    path: '/listAllRoles/:active',
    handler: listAllRoles,
  },
]

export default async (app: FastifyInstance) => {
  for (const route of routesRoles) {
    app[route.method](route.path, route.handler)
  }
}
