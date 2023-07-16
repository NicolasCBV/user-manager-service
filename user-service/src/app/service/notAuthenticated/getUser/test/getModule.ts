import { Test } from '@nestjs/testing';
import { DatabaseCacheModule } from '@root/src/infra/storages/cache/cache.module';
import { DatabaseTestModule } from '@root/src/infra/storages/db/databaseTest.module';
import { SearchUserManager } from '@root/src/infra/storages/search/searchUserManager.service';
import { GetUserService } from '../getUser.service';

export const getModuleOfGetUser = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseTestModule, DatabaseCacheModule],
    providers: [SearchUserManager, GetUserService],
  }).compile();

  return {
    searchManager: moduleRef.get(SearchUserManager),
    getUser: moduleRef.get(GetUserService),
  };
};
