import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@app/adapters/adapters.module';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { JwtService } from '@nestjs/jwt';
import { FinishForgotPasswordController } from '..';
import { FinishForgotPasswordService } from '@service/notAuthenticated/finishForgotPassword/finishForgotPassword.service';
import { CryptAdapter } from '@app/adapters/crypt';
import { EmailAdapter } from '@app/adapters/email';
import { UsersRepositories } from '@app/repositories/users';
import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';

export interface IFinishForgotPasswordModReturn {
  userRepo: UsersRepositories;
  tokenHandler: TokenHandlerContract;
  searchForUser: SearchUserManager;
  jwtService: JwtService;
  crypt: CryptAdapter;
  email: EmailAdapter;
  app: INestApplication;
}
export const getFinishForgotPasswordModuleE2E = async (): Promise<IFinishForgotPasswordModReturn> => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseModule, DatabaseCacheModule, AdaptersModule],
    controllers: [FinishForgotPasswordController],
    providers: [FinishForgotPasswordService, JwtService, SearchUserManager],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();

  return {
    userRepo: moduleRef.get(UsersRepositories),
    tokenHandler: moduleRef.get(TokenHandlerContract),
    searchForUser: moduleRef.get(SearchUserManager),
    jwtService: moduleRef.get(JwtService),
    crypt: moduleRef.get(CryptAdapter),
    email: moduleRef.get(EmailAdapter),
    app,
  };
};
