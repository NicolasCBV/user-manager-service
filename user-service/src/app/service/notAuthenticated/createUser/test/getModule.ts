import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@root/src/app/adapters/adapters.module';
import { UsersRepositories } from '@root/src/app/repositories/users';
import { DatabaseCacheModule } from '@root/src/infra/storages/cache/cache.module';
import { OTPHandlerContract } from '@root/src/infra/storages/cache/contract/OTPHandler';
import { UserHandlerContract } from '@root/src/infra/storages/cache/contract/userHandler';
import { DatabaseTestModule } from '@root/src/infra/storages/db/databaseTest.module';
import { CreateUserService } from '../createUser.service';

export const getCreateUserModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseTestModule, DatabaseCacheModule, AdaptersModule],
    providers: [CreateUserService],
  }).compile();

  return {
    createUserService: moduleRef.get(CreateUserService),
    userHandler: moduleRef.get(UserHandlerContract),
    otpHandler: moduleRef.get(OTPHandlerContract),
    userRepo: moduleRef.get(UsersRepositories),
  };
};
