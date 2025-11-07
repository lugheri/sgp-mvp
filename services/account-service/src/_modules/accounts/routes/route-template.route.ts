
import { RoutesServices } from '@/http/routes/routes'
import { checkLive } from '../controller/check-service.controller'
export const routesTemplate: RoutesServices[] = [
  {
    method: 'get',
    path: '/checkLiveTemplate',
    handler: checkLive,
  },
]