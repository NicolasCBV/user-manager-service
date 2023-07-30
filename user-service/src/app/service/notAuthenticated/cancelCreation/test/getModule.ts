import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@app/adapters/adapters.module';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import { OTPHandlerContract } from '@infra/storages/cache/contract/OTPHandler';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { CancelCreationService } from '../cancelCreation.service';

export const getCancelCreationModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseModule, DatabaseCacheModule, AdaptersModule],
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
