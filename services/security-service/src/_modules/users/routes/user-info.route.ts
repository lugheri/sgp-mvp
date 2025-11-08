/* eslint-disable @typescript-eslint/no-explicit-any */

import { FastifyInstance } from 'fastify'
import { updateUserInfo } from '../controller/user-info/update-user-info.controller'
import { createUserInfo } from '../controller/user-info/create-user-info.controller'
import { getUserInfo } from '../controller/user-info/get-user-info.controller'
import { findByUserIdUserInfo } from '../controller/user-info/find-by-user-id-user-info.controller'

export const routesUsersInfo: {
  method: 'post' | 'get' | 'put' | 'delete'
  path: string
  handler: any
}[] = [
  { method: 'post', path: '/createUserInfo', handler: createUserInfo },
  {
    method: 'get',
    path: '/getUserInfo/:account_id/:userinfo_id',
    handler: getUserInfo,
  },
  {
    method: 'get',
    path: '/findByUserIdUserInfo/:user_id',
    handler: findByUserIdUserInfo,
  },
  {
    method: 'put',
    path: '/updateUserInfo/:userinfo_id',
    handler: updateUserInfo,
  },
]

export default async (app: FastifyInstance) => {
  for (const route of routesUsersInfo) {
    app[route.method](route.path, route.handler)
  }
}
