/* eslint-disable @typescript-eslint/no-explicit-any */

import { FastifyInstance } from 'fastify'
import { listAllUsers } from '../controller/user/list-all-user.controller'
import { listUser } from '../controller/user/list-user.controller'
import { getUser } from '../controller/user/get-user.controller'
import { deleteUser } from '../controller/user/delete-user.controller'
import { createUser } from '../controller/user/create-user.controller'
import { checkLive } from '../controller/check-service.controller'
import { updateUser } from '../controller/user/update-user.controller'
export const routesUsers: {
  method: 'post' | 'get' | 'put' | 'delete'
  path: string
  handler: any
}[] = [
  {
    method: 'get',
    path: '/checkLiveUser',
    handler: checkLive,
  },
  { method: 'post', path: '/createUser', handler: createUser },
  { method: 'get', path: '/getUser/:account_id/:user_id', handler: getUser },
  {
    method: 'put',
    path: '/updateUser/:account_id/:user_id',
    handler: updateUser,
  },
  {
    method: 'delete',
    path: '/deleteUser/:account_id/:user_id',
    handler: deleteUser,
  },
  {
    method: 'get',
    path: '/listUsers/:account_id/:page/:active/:username_search',
    handler: listUser,
  },
  {
    method: 'get',
    path: '/listAllUsers/:account_id/:active',
    handler: listAllUsers,
  },
]

export default async (app: FastifyInstance) => {
  for (const route of routesUsers) {
    app[route.method](route.path, route.handler)
  }
}
