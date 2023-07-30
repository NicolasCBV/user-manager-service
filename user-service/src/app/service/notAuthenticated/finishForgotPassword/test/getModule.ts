import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@app/adapters/adapters.module';
import { CryptAdapter } from '@app/adapters/crypt';
import { UsersRepositories } from '@app/repositories/users';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { FinishForgotPasswordService } from '../finishForgotPassword.service';

export const getFinishForgotPasswordModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseModule, DatabaseCacheModule, AdaptersModule],
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
