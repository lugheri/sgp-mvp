/* eslint-disable @typescript-eslint/no-explicit-any */

import { FastifyInstance } from 'fastify'
import { listAllSystemModules } from '../controller/list-all-system-modules.controller'
import { listSystemModule } from '../controller/list-system-modules.controller'
import { getSystemModule } from '../controller/get-system-module.controller'
import { deleteSystemModule } from '../controller/delete-system-module.controller'
import { createSystemModule } from '../controller/create-system-module.controller'
import { updateSystemModule } from '../controller/update-system-module.controller'
import { addRoleSystemModule } from '../controller/add-role-system-module.controller'
import { removeRoleSystemModule } from '../controller/remove-role-system-module.controller'
import { listRolesSystemModule } from '../controller/list-roles-system-module.controller'
export const routesSystemModules: {
  method: 'post' | 'get' | 'put' | 'delete'
  path: string
  handler: any
}[] = [
  {
    method: 'post',
    path: '/createSystemModule',
    handler: createSystemModule,
  },
  {
    method: 'get',
    path: '/getSystemModule/:system_module_id',
    handler: getSystemModule,
  },
  {
    method: 'put',
    path: '/updateSystemModule/:system_module_id',
    handler: updateSystemModule,
  },
  {
    method: 'delete',
    path: '/deleteSystemModule/:system_module_id',
    handler: deleteSystemModule,
  },
  {
    method: 'get',
    path: '/listSystemModules/:page/:module_owner/:active/:name_search/:alias_search',
    handler: listSystemModule,
  },
  {
    method: 'get',
    path: '/listAllSystemModules/:module_owner/:active',
    handler: listAllSystemModules,
  },
  // Join Roles
  {
    method: 'post',
    path: '/addRoleSystemModule',
    handler: addRoleSystemModule,
  },
  {
    method: 'delete',
    path: '/removeRoleSystemModule/:system_module_id/:role_id',
    handler: removeRoleSystemModule,
  },
  {
    method: 'get',
    path: '/listRolesSystemModule/:system_module_id',
    handler: listRolesSystemModule,
  },
]

export default async (app: FastifyInstance) => {
  for (const route of routesSystemModules) {
    app[route.method](route.path, route.handler)
  }
}
