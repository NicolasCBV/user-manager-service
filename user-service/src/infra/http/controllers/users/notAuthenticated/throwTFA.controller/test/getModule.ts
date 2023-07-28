import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@app/adapters/adapters.module';
import { CryptAdapter } from '@app/adapters/crypt';
import { EmailAdapter } from '@app/adapters/email';
import { AuthModule } from '@app/auth/auth.module';
import { UsersRepositories } from '@app/repositories/users';
import { AuthService } from '@service/notAuthenticated/auth/auth.service';
import { GenTokensService } from '@app/service/notAuthenticated/genTokens.service';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import { OTPHandlerContract } from '@infra/storages/cache/contract/OTPHandler';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { ThrowTFAController } from '..';
import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';

export interface IThrowTFAModReturn {
  userRepo: UsersRepositories;
  genTokens: GenTokensService;
  crypt: CryptAdapter;
  tokenHandler: TokenHandlerContract;
  searchForUser: SearchUserManager;
  userHandler: UserHandlerContract;
  otpHandler: OTPHandlerContract;
  miscHandler: MiscellaneousHandlerContract;
  emailAdapter: EmailAdapter;
  app: INestApplication;
}
export const getThrowTFAModuleE2E = async (): Promise<IThrowTFAModReturn> => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseModule, DatabaseCacheModule, AdaptersModule, AuthModule],
    controllers: [ThrowTFAController],
    providers: [GenTokensService, JwtService, AuthService, SearchUserManager],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();

  return {
    userRepo: moduleRef.get(UsersRepositories),
    genTokens: moduleRef.get(GenTokensService),
    crypt: moduleRef.get(CryptAdapter),
    tokenHandler: moduleRef.get(TokenHandlerContract),
    searchForUser: moduleRef.get(SearchUserManager),
    userHandler: moduleRef.get(UserHandlerContract),
    otpHandler: moduleRef.get(OTPHandlerContract),
    miscHandler: moduleRef.get(MiscellaneousHandlerContract),
    emailAdapter: moduleRef.get(EmailAdapter),
    app,
  };
};
