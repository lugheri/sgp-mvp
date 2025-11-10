import { AxiosHttpClient } from '@/infra/services/axios-http-client'
import { FindAccountByName } from '../find-account-by-name.usecase'

const httpClient = new AxiosHttpClient('')
export const AuthUseCaseFactory = {
  findAccountByName: () => new FindAccountByName(httpClient),
}
