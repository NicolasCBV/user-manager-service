import { Test } from "@nestjs/testing"
import { AdaptersModule } from "@app/adapters/adapters.module"
import { DatabaseCacheModule } from "@infra/storages/cache/cache.module"
import { DatabaseModule } from "@infra/storages/db/database.module"
import { SearchUserManager } from "@infra/storages/search/searchUserManager.service"
import { UsersRepositories } from "@app/repositories/users"
import { UserHandlerContract } from "@infra/storages/cache/contract/userHandler"
import { TokenHandlerContract } from "@infra/storages/cache/contract/tokenHandler"
import { MiscellaneousHandlerContract } from "@infra/storages/cache/contract/miscellaneousHandler"
import { JwtService } from "@nestjs/jwt"
import { ForgotPasswordController } from ".."
import { ForgotPasswordService } from "@service/notAuthenticated/forgotPassword/forgotPassword.service"
import { ValidationPipe } from "@nestjs/common"

export const getForgotPasswordModuleE2E = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [
      DatabaseModule,
      DatabaseCacheModule,
      AdaptersModule
    ],
    controllers: [
      ForgotPasswordController
    ],
    providers: [
      ForgotPasswordService,
      JwtService,
      SearchUserManager
    ]
  }).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();

  return {
    userRepo: moduleRef.get(UsersRepositories),
    userHandler: moduleRef.get(UserHandlerContract),
    searchForUser: moduleRef.get(SearchUserManager),
    tokenHandler: moduleRef.get(TokenHandlerContract),
    miscHandler: moduleRef.get(MiscellaneousHandlerContract),
    app
  }
}
