import { Test } from '@nestjs/testing';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { GetUserService } from '../getUser.service';

export const getModuleOfGetUser = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseModule, DatabaseCacheModule],
    providers: [SearchUserManager, GetUserService],
  }).compile();

  return {
    searchManager: moduleRef.get(SearchUserManager),
    getUser: moduleRef.get(GetUserService),
  };
};
