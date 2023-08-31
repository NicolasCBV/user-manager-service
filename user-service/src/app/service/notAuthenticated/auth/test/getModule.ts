import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@app/adapters/adapters.module';
import { CryptAdapter } from '@app/adapters/crypt';
import { EmailAdapter } from '@app/adapters/email';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import { OTPHandlerContract } from '@infra/storages/cache/contract/OTPHandler';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { GenTokensService } from '../../genTokens.service';
import { AuthService } from '../auth.service';
import { UsersRepositories } from '@root/src/app/repositories/users';

export const getAuthModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseModule, AdaptersModule, DatabaseCacheModule],
    providers: [SearchUserManager, GenTokensService, JwtService, AuthService],
  }).compile();

  return {
    genToken: moduleRef.get(GenTokensService),
    crypt: moduleRef.get(CryptAdapter),
    tokenHandler: moduleRef.get(TokenHandlerContract),
    searchForUser: moduleRef.get(SearchUserManager),
    userRepo: moduleRef.get(UsersRepositories),
    userHandler: moduleRef.get(UserHandlerContract),
    otpHandler: moduleRef.get(OTPHandlerContract),
    miscHandler: moduleRef.get(MiscellaneousHandlerContract),
    emailAdapter: moduleRef.get(EmailAdapter),
    authService: moduleRef.get(AuthService),
  };
};
