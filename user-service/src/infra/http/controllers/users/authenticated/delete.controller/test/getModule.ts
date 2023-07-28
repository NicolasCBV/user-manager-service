import { Test } from '@nestjs/testing';
import { UsersRepositories } from '@app/repositories/users';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { ValidationPipe } from '@nestjs/common';
import { AdaptersModule } from '@app/adapters/adapters.module';
import { GenTokensService } from '@app/service/notAuthenticated/genTokens.service';
import { JwtService } from '@nestjs/jwt';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { AuthModule } from '@app/auth/auth.module';
import { CryptAdapter } from '@app/adapters/crypt';
import { DeleteUserController } from '..';
import { DeleteUserService } from '@service/authenticated/deleteUser/deleteUser.service';
import { ImageContract } from '@infra/api/contracts/imageContract';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import { ApiModule } from '@infra/api/api.module';
import { INestApplication } from '@nestjs/common';

export interface IDeleteUserModReturn {
  crypt: CryptAdapter;
  tokenHandler: TokenHandlerContract;
  genToken: GenTokensService;
  userRepo: UsersRepositories;
  userHandler: UserHandlerContract;
  imageContract: ImageContract;
  miscHandler: MiscellaneousHandlerContract;
  app: INestApplication;
}
export const getDeleteUserModuleE2E = async (): Promise<IDeleteUserModReturn> => {
  const moduleRef = await Test.createTestingModule({
    imports: [
      DatabaseModule,
      DatabaseCacheModule,
      AdaptersModule,
      ApiModule,
      AuthModule,
    ],
    controllers: [DeleteUserController],
    providers: [DeleteUserService, GenTokensService, JwtService],
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
    imageContract: moduleRef.get(ImageContract),
    miscHandler: moduleRef.get(MiscellaneousHandlerContract),
    app,
  };
};
