import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@app/adapters/adapters.module';
import { UsersRepositories } from '@app/repositories/users';
import { CreateUserService } from '@service/notAuthenticated/createUser/createUser.service';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { CreateUserController } from '..';

export const getCreateUserModuleE2E = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseCacheModule, DatabaseModule, AdaptersModule],
    controllers: [CreateUserController],
    providers: [CreateUserService],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();

  return {
    userRepo: moduleRef.get(UsersRepositories),
    userHandler: moduleRef.get(UserHandlerContract),
    app,
  };
};
