import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@root/src/app/adapters/adapters.module';
import { CryptAdapter } from '@root/src/app/adapters/crypt';
import { UsersRepositories } from '@root/src/app/repositories/users';
import { DatabaseCacheModule } from '@root/src/infra/storages/cache/cache.module';
import { MiscellaneousHandlerContract } from '@root/src/infra/storages/cache/contract/miscellaneousHandler';
import { TokenHandlerContract } from '@root/src/infra/storages/cache/contract/tokenHandler';
import { UserHandlerContract } from '@root/src/infra/storages/cache/contract/userHandler';
import { DatabaseTestModule } from '@root/src/infra/storages/db/databaseTest.module';
import { SearchUserManager } from '@root/src/infra/storages/search/searchUserManager.service';
import { FinishForgotPasswordService } from '../finishForgotPassword.service';

export const getFinishForgotPasswordModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseTestModule, DatabaseCacheModule, AdaptersModule],
    providers: [SearchUserManager, FinishForgotPasswordService],
  }).compile();

  return {
    userRepo: moduleRef.get(UsersRepositories),
    searchForUser: moduleRef.get(SearchUserManager),
    crypt: moduleRef.get(CryptAdapter),
    userHandler: moduleRef.get(UserHandlerContract),
    miscHandler: moduleRef.get(MiscellaneousHandlerContract),
    tokenHandler: moduleRef.get(TokenHandlerContract),
    finishForgotPassword: moduleRef.get(FinishForgotPasswordService),
  };
};
