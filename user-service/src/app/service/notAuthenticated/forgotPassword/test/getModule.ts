import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@app/adapters/adapters.module';
import { CryptAdapter } from '@app/adapters/crypt';
import { EmailAdapter } from '@app/adapters/email';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { ForgotPasswordService } from '../forgotPassword.service';

export const getForgotPasswordModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseModule, DatabaseCacheModule, AdaptersModule],
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
