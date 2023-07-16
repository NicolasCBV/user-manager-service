import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { DatabaseCacheModule } from '@root/src/infra/storages/cache/cache.module';
import { TokenHandlerContract } from '@root/src/infra/storages/cache/contract/tokenHandler';
import { ForgotTokenGuard } from '..';

export const getForgotTokenGuardModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseCacheModule],
    providers: [JwtService, ForgotTokenGuard],
  }).compile();

  return {
    tokenHandler: moduleRef.get(TokenHandlerContract),
    jwtService: moduleRef.get(JwtService),
    forgotTokenGuard: moduleRef.get(ForgotTokenGuard),
  };
};
