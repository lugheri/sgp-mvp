import { IHttpClientService } from '@/infra/interfaces/ihttp-client-service'
import { AccountType } from '../@dtos/AccountDTO'
import { InvalidCredentialsError } from '../errors/auth-invalid-credentials-error'

interface Request {
  name: string
}

interface Response {
  dataAccount: AccountType
}

export class FindAccountByName {
  constructor(private httpClient: IHttpClientService) {}

  async execute({ name }: Request): Promise<Response> {
    this.httpClient.setInternal(true)
    const dataAccount = await this.httpClient.get<AccountType>(
      `http://account-service:10001/findByName/${name}`,
    )
    if (!dataAccount) {
      throw new InvalidCredentialsError()
    }
    return { dataAccount }
  }
}
