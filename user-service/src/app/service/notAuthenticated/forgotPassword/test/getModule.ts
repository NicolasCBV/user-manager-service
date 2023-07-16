import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@root/src/app/adapters/adapters.module';
import { CryptAdapter } from '@root/src/app/adapters/crypt';
import { EmailAdapter } from '@root/src/app/adapters/email';
import { DatabaseCacheModule } from '@root/src/infra/storages/cache/cache.module';
import { TokenHandlerContract } from '@root/src/infra/storages/cache/contract/tokenHandler';
import { DatabaseTestModule } from '@root/src/infra/storages/db/databaseTest.module';
import { SearchUserManager } from '@root/src/infra/storages/search/searchUserManager.service';
import { ForgotPasswordService } from '../forgotPassword.service';

export const getForgotPasswordModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseTestModule, DatabaseCacheModule, AdaptersModule],
    providers: [ForgotPasswordService, JwtService, SearchUserManager],
  }).compile();

  return {
    searchForUser: moduleRef.get(SearchUserManager),
    tokenHandler: moduleRef.get(TokenHandlerContract),
    jwtService: moduleRef.get(JwtService),
    email: moduleRef.get(EmailAdapter),
    crypt: moduleRef.get(CryptAdapter),
    forgotPassword: moduleRef.get(ForgotPasswordService),
  };
};
