import { Test } from '@nestjs/testing';
import { UsersRepositories } from '@root/src/app/repositories/users';
import { ApiModule } from '@root/src/infra/api/api.module';
import { ImageContract } from '@root/src/infra/api/contracts/imageContract';
import { DatabaseCacheModule } from '@root/src/infra/storages/cache/cache.module';
import { MiscellaneousHandlerContract } from '@root/src/infra/storages/cache/contract/miscellaneousHandler';
import { UserHandlerContract } from '@root/src/infra/storages/cache/contract/userHandler';
import { DatabaseTestModule } from '@root/src/infra/storages/db/databaseTest.module';
import { DeleteUserService } from '../deleteUser.service';

export const getDeleteUserModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseTestModule, DatabaseCacheModule, ApiModule],
    providers: [DeleteUserService],
  }).compile();

  return {
    userRepo: moduleRef.get(UsersRepositories),
    miscHandler: moduleRef.get(MiscellaneousHandlerContract),
    userHandler: moduleRef.get(UserHandlerContract),
    imageContract: moduleRef.get(ImageContract),
    deleteUser: moduleRef.get(DeleteUserService),
  };
};
