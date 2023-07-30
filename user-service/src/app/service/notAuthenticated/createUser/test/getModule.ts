import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@src/app/adapters/adapters.module';
import { UsersRepositories } from '@src/app/repositories/users';
import { DatabaseCacheModule } from '@src/infra/storages/cache/cache.module';
import { OTPHandlerContract } from '@src/infra/storages/cache/contract/OTPHandler';
import { UserHandlerContract } from '@src/infra/storages/cache/contract/userHandler';
import { DatabaseModule } from '@src/infra/storages/db/database.module';
import { CreateUserService } from '../createUser.service';

export const getCreateUserModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseModule, DatabaseCacheModule, AdaptersModule],
    providers: [CreateUserService],
  }).compile();

  return {
    createUserService: moduleRef.get(CreateUserService),
    userHandler: moduleRef.get(UserHandlerContract),
    otpHandler: moduleRef.get(OTPHandlerContract),
    userRepo: moduleRef.get(UsersRepositories),
  };
};
