import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@app/adapters/adapters.module';
import { CryptAdapter } from '@app/adapters/crypt';
import { CancelCreationService } from '@service/notAuthenticated/cancelCreation/cancelCreation.service';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { CancelCreationController } from '..';
import { UsersRepositories } from '@root/src/app/repositories/users';

export const getCancelCreationModuleE2E = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseCacheModule, DatabaseModule, AdaptersModule],
    controllers: [CancelCreationController],
    providers: [CancelCreationService],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();

  return {
    userHandler: moduleRef.get(UsersRepositories),
    miscHandler: moduleRef.get(MiscellaneousHandlerContract),
    crypt: moduleRef.get(CryptAdapter),
    app,
  };
};
