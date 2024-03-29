import { Test } from '@nestjs/testing';
import { UsersRepositories } from '@app/repositories/users';
import { GetUserService } from '@service/notAuthenticated/getUser/getUser.service';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { GetUserController } from '..';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { INestApplication } from '@nestjs/common';

export interface IGetUserModReturn {
  searchUserManager: SearchUserManager;
  userRepo: UsersRepositories;
  app: INestApplication;
}
export const getModulesOfGetUserE2E = async (): Promise<IGetUserModReturn> => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseCacheModule, DatabaseModule],
    controllers: [GetUserController],
    providers: [GetUserService, SearchUserManager],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  return {
    searchUserManager: moduleRef.get(SearchUserManager),
    userRepo: moduleRef.get(UsersRepositories),
    app,
  };
};
