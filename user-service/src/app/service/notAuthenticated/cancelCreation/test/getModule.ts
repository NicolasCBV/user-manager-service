import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@root/src/app/adapters/adapters.module';
import { DatabaseCacheModule } from '@root/src/infra/storages/cache/cache.module';
import { MiscellaneousHandlerContract } from '@root/src/infra/storages/cache/contract/miscellaneousHandler';
import { OTPHandlerContract } from '@root/src/infra/storages/cache/contract/OTPHandler';
import { UserHandlerContract } from '@root/src/infra/storages/cache/contract/userHandler';
import { DatabaseTestModule } from '@root/src/infra/storages/db/databaseTest.module';
import { CancelCreationService } from '../cancelCreation.service';

export const getCancelCreationModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseTestModule, DatabaseCacheModule, AdaptersModule],
    providers: [CancelCreationService],
  }).compile();

  const miscHandler = moduleRef.get(MiscellaneousHandlerContract);
  const otpHandler = moduleRef.get(OTPHandlerContract);
  const userHandler = moduleRef.get(UserHandlerContract);
  const cancelCreationService = moduleRef.get(CancelCreationService);

  return {
    miscHandler,
    otpHandler,
    userHandler,
    cancelCreationService,
  };
};
