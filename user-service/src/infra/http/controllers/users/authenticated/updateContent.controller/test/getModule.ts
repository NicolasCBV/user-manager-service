import { Test } from '@nestjs/testing';
import { UsersRepositories } from '@app/repositories/users';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { ValidationPipe } from '@nestjs/common';
import { UpdateUserService } from '@service/authenticated/updateUser/updateUser.service';
import { UpdateUserContentController } from '..';
import { AdaptersModule } from '@app/adapters/adapters.module';
import { GenTokensService } from '@app/service/notAuthenticated/genTokens.service';
import { JwtService } from '@nestjs/jwt';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { AuthModule } from '@app/auth/auth.module';
import { CryptAdapter } from '@app/adapters/crypt';
import { INestApplication } from '@nestjs/common';

export interface IUpdateContentModReturn {
  crypt: CryptAdapter;
  tokenHandler: TokenHandlerContract;
  genToken: GenTokensService;
  userRepo: UsersRepositories;
  userHandler: UserHandlerContract;
  app: INestApplication;
}
export const getUpdateContentModuleE2E = async (): Promise<IUpdateContentModReturn> => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseModule, DatabaseCacheModule, AdaptersModule, AuthModule],
    controllers: [UpdateUserContentController],
    providers: [UpdateUserService, GenTokensService, JwtService],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();

  return {
    crypt: moduleRef.get(CryptAdapter),
    tokenHandler: moduleRef.get(TokenHandlerContract),
    genToken: moduleRef.get(GenTokensService),
    userRepo: moduleRef.get(UsersRepositories),
    userHandler: moduleRef.get(UserHandlerContract),
    app,
  };
};
