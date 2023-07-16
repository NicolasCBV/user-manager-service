import { Test } from '@nestjs/testing';
import { UsersRepositories } from '@root/src/app/repositories/users';
import { DatabaseCacheModule } from '@root/src/infra/storages/cache/cache.module';
import { UserHandlerContract } from '@root/src/infra/storages/cache/contract/userHandler';
import { DatabaseTestModule } from '@root/src/infra/storages/db/databaseTest.module';
import { UpdateUserService } from '../updateUser.service';

export const getUpdateUserModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseTestModule, DatabaseCacheModule],
    providers: [UpdateUserService],
  }).compile();

  return {
    userHandler: moduleRef.get(UserHandlerContract),
    userRepo: moduleRef.get(UsersRepositories),
    updateUser: moduleRef.get(UpdateUserService),
  };
};
