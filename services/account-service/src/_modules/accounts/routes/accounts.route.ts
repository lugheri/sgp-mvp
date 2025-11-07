/* eslint-disable @typescript-eslint/no-explicit-any */
import { checkLive } from '../controller/check-service.controller'
import { createAccount } from '../controller/create-account.controller'
import { getAccount } from '../controller/get-account.controller'
import { updateAccount } from '../controller/update-account.controller'
import { deleteAccount } from '../controller/delete-account.controller'
import { listAccount } from '../controller/list-accounts.controller'
import { listAllAccounts } from '../controller/list-all-accounts.controller'
import { FastifyInstance } from 'fastify'
export const routesAccounts: {
  method: 'post' | 'get' | 'put' | 'delete'
  path: string
  handler: any
}[] = [
  {
    method: 'get',
    path: '/checkLiveAccount',
    handler: checkLive,
  },
  { method: 'post', path: '/createAccount', handler: createAccount },
  { method: 'get', path: '/getAccount/:account_id', handler: getAccount },
  { method: 'put', path: '/updateAccount/:account_id', handler: updateAccount },
  {
    method: 'delete',
    path: '/deleteAccount/:account_id',
    handler: deleteAccount,
  },
  {
    method: 'get',
    path: '/listAccounts/:page/:active/:agreed/:name_search',
    handler: listAccount,
  },
  {
    method: 'get',
    path: '/listAllAccounts/:active/:agreed',
    handler: listAllAccounts,
  },
]

export default async (app: FastifyInstance) => {
  for (const route of routesAccounts) {
    app[route.method](route.path, route.handler)
  }
}
