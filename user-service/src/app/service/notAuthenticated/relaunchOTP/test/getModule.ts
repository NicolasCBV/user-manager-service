import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@root/src/app/adapters/adapters.module';
import { CryptAdapter } from '@root/src/app/adapters/crypt';
import { EmailAdapter } from '@root/src/app/adapters/email';
import { UsersRepositories } from '@root/src/app/repositories/users';
import { DatabaseCacheModule } from '@root/src/infra/storages/cache/cache.module';
import { OTPHandlerContract } from '@root/src/infra/storages/cache/contract/OTPHandler';
import { UserHandlerContract } from '@root/src/infra/storages/cache/contract/userHandler';
import { DatabaseTestModule } from '@root/src/infra/storages/db/databaseTest.module';
import { RelaunchOTPService } from '../relaunchOTP.service';

export const getRelaunchOTPModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseTestModule, DatabaseCacheModule, AdaptersModule],
    providers: [RelaunchOTPService],
  }).compile();

  return {
    crypt: moduleRef.get(CryptAdapter),
    email: moduleRef.get(EmailAdapter),
    userRepo: moduleRef.get(UsersRepositories),
    otpHandler: moduleRef.get(OTPHandlerContract),
    userHandler: moduleRef.get(UserHandlerContract),
    relaunchOTP: moduleRef.get(RelaunchOTPService),
  };
};
