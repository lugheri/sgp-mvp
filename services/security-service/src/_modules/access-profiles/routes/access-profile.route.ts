/* eslint-disable @typescript-eslint/no-explicit-any */

import { FastifyInstance } from 'fastify'
import { listAllAccessProfiles } from '../controller/list-all-access-profile.controller'
import { listAccessProfile } from '../controller/list-access-profile.controller'
import { getAccessProfile } from '../controller/get-access-profile.controller'
import { deleteAccessProfile } from '../controller/delete-access-profile.controller'
import { createAccessProfile } from '../controller/create-access-profile.controller'
import { updateAccessProfile } from '../controller/update-access-profile.controller'
import { addRoleAccessProfile } from '../controller/add-role-access-profile.controller'
import { removeRoleAccessProfile } from '../controller/remove-role-access-profile.controller'
import { listRolesAccessProfile } from '../controller/list-roles-access-profile.controller'
export const routesAccessProfiles: {
  method: 'post' | 'get' | 'put' | 'delete'
  path: string
  handler: any
}[] = [
  {
    method: 'post',
    path: '/createAccessProfile',
    handler: createAccessProfile,
  },
  {
    method: 'get',
    path: '/getAccessProfile/:account_id/:access_profile_id',
    handler: getAccessProfile,
  },
  {
    method: 'put',
    path: '/updateAccessProfile/:account_id/:access_profile_id',
    handler: updateAccessProfile,
  },
  {
    method: 'delete',
    path: '/deleteAccessProfile/:account_id/:access_profile_id',
    handler: deleteAccessProfile,
  },
  {
    method: 'get',
    path: '/listAccessProfiles/:account_id/:page/:active/:name_search',
    handler: listAccessProfile,
  },
  {
    method: 'get',
    path: '/listAllAccessProfiles/:account_id/:active',
    handler: listAllAccessProfiles,
  },
  // Join Roles
  {
    method: 'post',
    path: '/addRoleAccessProfile',
    handler: addRoleAccessProfile,
  },
  {
    method: 'delete',
    path: '/removeRoleAccessProfile/:access_profile_id/:role_id',
    handler: removeRoleAccessProfile,
  },
  {
    method: 'get',
    path: '/listRolesAccessProfile/:access_profile_id',
    handler: listRolesAccessProfile,
  },
]

export default async (app: FastifyInstance) => {
  for (const route of routesAccessProfiles) {
    app[route.method](route.path, route.handler)
  }
}
