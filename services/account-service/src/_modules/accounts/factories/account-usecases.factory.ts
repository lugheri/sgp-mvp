import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository'
import { PrismaAccountRepository } from '../repositories/implementations/prisma-account.repository'
import { CreateAccountUseCase } from '../usecases/create-account-usecase'
import { PrismaClient } from '@prisma/client'
import { GetAccountUseCase } from '../usecases/get-account-usecase'
import { UpdateAccountUseCase } from '../usecases/update-account-usecase'
import { ListAllAccountsUseCase } from '../usecases/list-all-accounts-usecase'
import { ListAccountsUseCase } from '../usecases/list-accounts-usecase'
import { DeleteAccountUseCase } from '../usecases/delete-account-usecase'

const cacheRepository = new RedisCacheRepository()
const prismaClient = new PrismaClient()
const accountRepository = new PrismaAccountRepository(
  cacheRepository,
  prismaClient,
)
export const AccountUseCaseFactory = {
  createAccount: () => new CreateAccountUseCase(accountRepository),
  getAccount: () => new GetAccountUseCase(accountRepository),
  updateAccount: () => new UpdateAccountUseCase(accountRepository),
  deleteAccount: () => new DeleteAccountUseCase(accountRepository),
  listAccounts: () => new ListAccountsUseCase(accountRepository),
  listAllAccounts: () => new ListAllAccountsUseCase(accountRepository),
}
