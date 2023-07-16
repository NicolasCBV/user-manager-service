import { Test } from '@nestjs/testing';
import { DatabaseCacheModule } from '@root/src/infra/storages/cache/cache.module';
import { TokenHandlerContract } from '@root/src/infra/storages/cache/contract/tokenHandler';
import { DatabaseTestModule } from '@root/src/infra/storages/db/databaseTest.module';
import { SearchUserManager } from '@root/src/infra/storages/search/searchUserManager.service';
import { GenTokensService } from '../../../notAuthenticated/genTokens.service';
import { RefreshTokenService } from '../refreshToken.service';

export const getRefreshTokenModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseTestModule, DatabaseCacheModule],
    providers: [RefreshTokenService, GenTokensService, SearchUserManager],
  }).compile();

  return {
    genTokens: moduleRef.get(GenTokensService),
    tokenHandler: moduleRef.get(TokenHandlerContract),
    searchForUser: moduleRef.get(SearchUserManager),
    refreshToken: moduleRef.get(RefreshTokenService),
  };
};
