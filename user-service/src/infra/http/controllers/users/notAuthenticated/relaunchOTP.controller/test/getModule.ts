import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@app/adapters/adapters.module';
import { CryptAdapter } from '@app/adapters/crypt';
import { EmailAdapter } from '@app/adapters/email';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { OTPHandlerContract } from '@infra/storages/cache/contract/OTPHandler';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { ValidationPipe } from '@nestjs/common';
import { RelaunchOTPController } from '../../relaunchOTP.controller';
import { RelaunchOTPService } from '@service/notAuthenticated/relaunchOTP/relaunchOTP.service';
import { UsersRepositories } from '@app/repositories/users';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import { INestApplication } from '@nestjs/common';

export interface IRelaunchOTPModReturn {
  miscHandler: MiscellaneousHandlerContract;
  userRepo: UsersRepositories;
  crypt: CryptAdapter;
  email: EmailAdapter;
  userHandler: UserHandlerContract;
  otpHandler: OTPHandlerContract;
  app: INestApplication;
}
export const getRelaunchOTPModuleE2E = async (): Promise<IRelaunchOTPModReturn> => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseModule, DatabaseCacheModule, AdaptersModule],
    controllers: [RelaunchOTPController],
    providers: [RelaunchOTPService],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();

  return {
    miscHandler: moduleRef.get(MiscellaneousHandlerContract),
    userRepo: moduleRef.get(UsersRepositories),
    crypt: moduleRef.get(CryptAdapter),
    email: moduleRef.get(EmailAdapter),
    userHandler: moduleRef.get(UserHandlerContract),
    otpHandler: moduleRef.get(OTPHandlerContract),
    app,
  };
};
