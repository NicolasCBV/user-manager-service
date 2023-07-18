import { Test } from '@nestjs/testing';
import { UsersRepositories } from '@app/repositories/users';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { UpdateUserService } from '../updateUser.service';

export const getUpdateUserModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseModule, DatabaseCacheModule],
    providers: [UpdateUserService],
  }).compile();

  return {
    userHandler: moduleRef.get(UserHandlerContract),
    userRepo: moduleRef.get(UsersRepositories),
    updateUser: moduleRef.get(UpdateUserService),
  };
};
