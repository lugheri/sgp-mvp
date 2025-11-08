/* eslint-disable @typescript-eslint/no-explicit-any */
import { checkLive } from '../controller/check-service.controller'
import { createTemplate } from '../controller/create-template.controller'
import { getTemplate } from '../controller/get-template.controller'
import { updateTemplate } from '../controller/update-template.controller'
import { deleteTemplate } from '../controller/delete-template.controller'
import { listTemplate } from '../controller/list-templates.controller'
import { listAllTemplates } from '../controller/list-all-templates.controller'
import { FastifyInstance } from 'fastify'
export const routesTemplates: {
  method: 'post' | 'get' | 'put' | 'delete'
  path: string
  handler: any
}[] = [
  {
    method: 'get',
    path: '/checkLiveTemplate',
    handler: checkLive,
  },
  { method: 'post', path: '/createTemplate', handler: createTemplate },
  { method: 'get', path: '/getTemplate/:template_id', handler: getTemplate },
  { method: 'put', path: '/updateTemplate/:template_id', handler: updateTemplate },
  {
    method: 'delete',
    path: '/deleteTemplate/:template_id',
    handler: deleteTemplate,
  },
  {
    method: 'get',
    path: '/listTemplates/:page/:active/:agreed/:name_search',
    handler: listTemplate,
  },
  {
    method: 'get',
    path: '/listAllTemplates/:active/:agreed',
    handler: listAllTemplates,
  },
]

export default async (app: FastifyInstance) => {
  for (const route of routesTemplates) {
    app[route.method](route.path, route.handler)
  }
}
