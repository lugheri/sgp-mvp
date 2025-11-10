import { IHttpClientService } from '@/infra/interfaces/ihttp-client-service'
import { AccountType } from '../@dtos/AccountDTO'

interface Request {
  name: string
}

interface Response {
  accountCreated: AccountType | undefined
}

export class FindAccountByName {
  constructor(private httpClient: IHttpClientService) {}

  async execute({ name }: Request) {
    this.httpClient.setInternal(true)
    const accountCreated = await this.httpClient.get<Response>(
      `http://account-service:10001/findByName/${name}`,
    )
    return { accountCreated }
  }
}
