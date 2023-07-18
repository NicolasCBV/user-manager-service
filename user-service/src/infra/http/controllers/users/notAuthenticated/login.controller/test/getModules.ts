import { Test } from "@nestjs/testing"
import { AdaptersModule } from "@app/adapters/adapters.module"
import { DatabaseCacheModule } from "@infra/storages/cache/cache.module"
import { SearchUserManager } from "@infra/storages/search/searchUserManager.service"
import { UserHandlerContract } from "@infra/storages/cache/contract/userHandler"
import { TokenHandlerContract } from "@infra/storages/cache/contract/tokenHandler"
import { MiscellaneousHandlerContract } from "@infra/storages/cache/contract/miscellaneousHandler"
import { JwtService } from "@nestjs/jwt"
import { LoginController } from ".."
import { ValidationPipe } from "@nestjs/common"
import { GenTokensService } from "@app/service/notAuthenticated/genTokens.service"
import { OTPHandlerContract } from "@infra/storages/cache/contract/OTPHandler"
import { EmailAdapter } from "@app/adapters/email"
import { CryptAdapter } from "@app/adapters/crypt"
import { AuthModule } from "@app/auth/auth.module"
import { AuthService } from "@service/notAuthenticated/auth/auth.service"
import { UsersRepositories } from "@app/repositories/users"
import { DatabaseModule } from "@infra/storages/db/database.module"
import * as cookieParser from "cookie-parser"

export const getAuthModuleE2E = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [
      DatabaseModule,
      DatabaseCacheModule,
      AdaptersModule,
      AuthModule
    ],
    controllers: [
      LoginController
    ],
    providers: [
      GenTokensService,
      JwtService,
      AuthService,
      SearchUserManager
    ]
  }).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  await app.init();

  return {
    userRepo: moduleRef.get(UsersRepositories),
    genTokens: moduleRef.get(GenTokensService),
    crypt: moduleRef.get(CryptAdapter),
    tokenHandler: moduleRef.get(TokenHandlerContract),
    searchForUser: moduleRef.get(SearchUserManager),
    userHandler: moduleRef.get(UserHandlerContract),
    otpHandler: moduleRef.get(OTPHandlerContract),
    miscHandler: moduleRef.get(MiscellaneousHandlerContract),
    emailAdapter: moduleRef.get(EmailAdapter),
    app
  }
}

