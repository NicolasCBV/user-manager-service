import { Test } from '@nestjs/testing';
import { UsersRepositories } from '@app/repositories/users';
import { ApiModule } from '@infra/api/api.module';
import { ImageContract } from '@infra/api/contracts/imageContract';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { DeleteUserService } from '../deleteUser.service';

export const getDeleteUserModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseModule, DatabaseCacheModule, ApiModule],
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
