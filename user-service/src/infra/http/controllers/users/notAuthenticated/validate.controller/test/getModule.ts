import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@app/adapters/adapters.module';
import { GenTokensService } from '@app/service/notAuthenticated/genTokens.service';
import { ValidateAccountService } from '@service/notAuthenticated/validateAccount/validateAccount.service';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { ValidateUserController } from '..';
import { UsersRepositories } from '@app/repositories/users';
import { CryptAdapter } from '@app/adapters/crypt';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { OTPHandlerContract } from '@infra/storages/cache/contract/OTPHandler';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';

export interface IValidateAccountModReturn {
  genTokens: GenTokensService;
  userRepo: UsersRepositories;
  crypt: CryptAdapter;
  userHandler: UserHandlerContract;
  OTPHandler: OTPHandlerContract;
  miscHandler: MiscellaneousHandlerContract;
  app: INestApplication;
}
export const getValidateAccountModuleE2E = async (): Promise<IValidateAccountModReturn> => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseModule, DatabaseCacheModule, AdaptersModule],
    controllers: [ValidateUserController],
    providers: [GenTokensService, JwtService, ValidateAccountService],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  await app.init();

  return {
    genTokens: moduleRef.get(GenTokensService),
    userRepo: moduleRef.get(UsersRepositories),
    crypt: moduleRef.get(CryptAdapter),
    userHandler: moduleRef.get(UserHandlerContract),
    OTPHandler: moduleRef.get(OTPHandlerContract),
    miscHandler: moduleRef.get(MiscellaneousHandlerContract),
    app,
  };
};
