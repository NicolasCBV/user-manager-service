import { Test } from '@nestjs/testing';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { GenTokensService } from '../../../notAuthenticated/genTokens.service';
import { RefreshTokenService } from '../refreshToken.service';

export const getRefreshTokenModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseModule, DatabaseCacheModule],
    providers: [RefreshTokenService, GenTokensService, SearchUserManager],
  }).compile();

  return {
    genTokens: moduleRef.get(GenTokensService),
    tokenHandler: moduleRef.get(TokenHandlerContract),
    searchForUser: moduleRef.get(SearchUserManager),
    refreshToken: moduleRef.get(RefreshTokenService),
  };
};
