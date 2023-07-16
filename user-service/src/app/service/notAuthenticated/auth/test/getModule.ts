import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@root/src/app/adapters/adapters.module';
import { CryptAdapter } from '@root/src/app/adapters/crypt';
import { EmailAdapter } from '@root/src/app/adapters/email';
import { DatabaseCacheModule } from '@root/src/infra/storages/cache/cache.module';
import { MiscellaneousHandlerContract } from '@root/src/infra/storages/cache/contract/miscellaneousHandler';
import { OTPHandlerContract } from '@root/src/infra/storages/cache/contract/OTPHandler';
import { TokenHandlerContract } from '@root/src/infra/storages/cache/contract/tokenHandler';
import { UserHandlerContract } from '@root/src/infra/storages/cache/contract/userHandler';
import { DatabaseTestModule } from '@root/src/infra/storages/db/databaseTest.module';
import { SearchUserManager } from '@root/src/infra/storages/search/searchUserManager.service';
import { GenTokensService } from '../../genTokens.service';
import { AuthService } from '../auth.service';

export const getAuthModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseTestModule, AdaptersModule, DatabaseCacheModule],
    providers: [SearchUserManager, GenTokensService, JwtService, AuthService],
  }).compile();

  return {
    genToken: moduleRef.get(GenTokensService),
    crypt: moduleRef.get(CryptAdapter),
    tokenHandler: moduleRef.get(TokenHandlerContract),
    searchForUser: moduleRef.get(SearchUserManager),
    userHandler: moduleRef.get(UserHandlerContract),
    otpHandler: moduleRef.get(OTPHandlerContract),
    miscHandler: moduleRef.get(MiscellaneousHandlerContract),
    emailAdapter: moduleRef.get(EmailAdapter),
    authService: moduleRef.get(AuthService),
  };
};
