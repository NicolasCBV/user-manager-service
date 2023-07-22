import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@app/adapters/adapters.module';
import { CookieAdapter } from '@app/adapters/cookie';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { RefreshTokenGuard } from '..';
import { TokenHandlerContract } from '@root/src/infra/storages/cache/contract/tokenHandler';

export const getRefreshTokenGuardModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseCacheModule, AdaptersModule],
    providers: [JwtService, RefreshTokenGuard],
  }).compile();

  return {
    tokenHandler: moduleRef.get(TokenHandlerContract),
    cookieAdapter: moduleRef.get(CookieAdapter),
    jwtService: moduleRef.get(JwtService),
    refreshTokenGuard: moduleRef.get(RefreshTokenGuard),
  };
};
