import { PrismaClient } from '@prisma/client'
import { PrismaAccountRepository } from '../../repositories/implementations/prisma-account.repository'
import { CreateAccountUseCase } from '../create-account-usecase'
import { DeleteAccountUseCase } from '../delete-account-usecase'
import { GetAccountUseCase } from '../get-account-usecase'
import { ListAccountsUseCase } from '../list-accounts-usecase'
import { ListAllAccountsUseCase } from '../list-all-accounts-usecase'
import { UpdateAccountUseCase } from '../update-account-usecase'
import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository'
import { FindByNameAccountUseCase } from '../find-by-name-account-usecase'

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
  findByName: () => new FindByNameAccountUseCase(accountRepository),
}
