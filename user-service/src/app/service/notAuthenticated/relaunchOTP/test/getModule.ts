import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@app/adapters/adapters.module';
import { CryptAdapter } from '@app/adapters/crypt';
import { EmailAdapter } from '@app/adapters/email';
import { UsersRepositories } from '@app/repositories/users';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { OTPHandlerContract } from '@infra/storages/cache/contract/OTPHandler';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { RelaunchOTPService } from '../relaunchOTP.service';

export const getRelaunchOTPModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseModule, DatabaseCacheModule, AdaptersModule],
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
