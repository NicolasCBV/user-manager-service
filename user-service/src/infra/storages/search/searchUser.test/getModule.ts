import { Test } from '@nestjs/testing';
import { UsersRepositories } from '@root/src/app/repositories/users';
import { DatabaseCacheModule } from '../../cache/cache.module';
import { UserHandlerContract } from '../../cache/contract/userHandler';
import { DatabaseTestModule } from '../../db/databaseTest.module';
import { SearchUserManager } from '../searchUserManager.service';

export const getSearchUserManagerModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseTestModule, DatabaseCacheModule],
    providers: [SearchUserManager],
  }).compile();

  return {
    userHandler: moduleRef.get(UserHandlerContract),
    userRepo: moduleRef.get(UsersRepositories),
    searchUserManager: moduleRef.get(SearchUserManager),
  };
};
