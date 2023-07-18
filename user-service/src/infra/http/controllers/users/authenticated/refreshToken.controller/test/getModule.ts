import { Test } from "@nestjs/testing"
import { DatabaseCacheModule } from "@infra/storages/cache/cache.module"
import { DatabaseModule } from "@infra/storages/db/database.module"
import { ValidationPipe } from "@nestjs/common"
import { AdaptersModule } from "@app/adapters/adapters.module"
import { GenTokensService } from "@app/service/notAuthenticated/genTokens.service"
import { JwtService } from "@nestjs/jwt"
import { TokenHandlerContract } from "@infra/storages/cache/contract/tokenHandler"
import { AuthModule } from "@app/auth/auth.module"
import { CryptAdapter } from "@app/adapters/crypt"
import { RefreshTokenController } from ".."
import { RefreshTokenService } from "@service/authenticated/refreshToken/refreshToken.service"
import { SearchUserManager } from "@infra/storages/search/searchUserManager.service"
import * as cookieParser from "cookie-parser"
import { UsersRepositories } from "@app/repositories/users"

export const getRefreshTokenModuleE2E = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [
      DatabaseModule,
      DatabaseCacheModule,
      AdaptersModule,
      AuthModule
    ],
    controllers: [RefreshTokenController],
    providers: [
      RefreshTokenService,
      SearchUserManager,
      GenTokensService,
      JwtService
    ]
  }).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  await app.init();

  return {
    crypt: moduleRef.get(CryptAdapter),
    tokenHandler: moduleRef.get(TokenHandlerContract),
    genToken: moduleRef.get(GenTokensService),
    userRepo: moduleRef.get(UsersRepositories),
    app
  }
}

