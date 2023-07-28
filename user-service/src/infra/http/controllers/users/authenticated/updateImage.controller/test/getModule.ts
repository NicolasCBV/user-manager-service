import { Test } from '@nestjs/testing';
import { UsersRepositories } from '@app/repositories/users';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { ValidationPipe } from '@nestjs/common';
import { AdaptersModule } from '@app/adapters/adapters.module';
import { GenTokensService } from '@service/notAuthenticated/genTokens.service';
import { JwtService } from '@nestjs/jwt';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { AuthModule } from '@app/auth/auth.module';
import { CryptAdapter } from '@app/adapters/crypt';
import { UpdateUserImageController } from '..';
import { ApiModule } from '@infra/api/api.module';
import { UploadImageService } from '@service/authenticated/uploadImage/uploadImage.service';
import { INestApplication } from '@nestjs/common';

export interface IUploadImageModReturn {
  crypt: CryptAdapter;
  tokenHandler: TokenHandlerContract;
  genToken: GenTokensService;
  userRepo: UsersRepositories;
  userHandler: UserHandlerContract;
  app: INestApplication;
}
export const getUploadImageModuleE2E = async (): Promise<IUploadImageModReturn> => {
  const moduleRef = await Test.createTestingModule({
    imports: [
      DatabaseModule,
      DatabaseCacheModule,
      AdaptersModule,
      ApiModule,
      AuthModule,
    ],
    controllers: [UpdateUserImageController],
    providers: [UploadImageService, GenTokensService, JwtService],
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
