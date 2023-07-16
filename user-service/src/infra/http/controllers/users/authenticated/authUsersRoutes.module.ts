import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { DeleteUserService } from '@app/service/authenticated/deleteUser/deleteUser.service';
import { RefreshTokenService } from '@app/service/authenticated/refreshToken/refreshToken.service';
import { UpdateUserService } from '@app/service/authenticated/updateUser/updateUser.service';
import { UploadImageService } from '@app/service/authenticated/uploadImage/uploadImage.service';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { GenTokensService } from '@app/service/notAuthenticated/genTokens.service';

import { DeleteUserController } from './delete.controller';
import { RefreshTokenController } from './refreshToken.controller';
import { UpdateUserContentController } from './updateContent.controller';
import { UpdateUserImageController } from './updateImage.controller';

import { AdaptersModule } from '@app/adapters/adapters.module';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { AuthModule } from '@app/auth/auth.module';
import { ApiModule } from '@infra/api/api.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    DatabaseCacheModule,
    ApiModule,
    AdaptersModule,
  ],
  controllers: [
    DeleteUserController,
    RefreshTokenController,
    UpdateUserContentController,
    UpdateUserImageController,
  ],
  providers: [
    GenTokensService,
    JwtService,
    DeleteUserService,
    RefreshTokenService,
    UploadImageService,
    UpdateUserService,
    SearchUserManager,
  ],
})
export class AuthUsersRoutes {}
