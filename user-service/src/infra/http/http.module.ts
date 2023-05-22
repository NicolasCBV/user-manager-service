import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AdaptersModule } from '@src/app/adapters/adapters.module';
import { AuthModule } from '@src/app/auth/auth.module';
import { ApiModule } from '../api/api.module';
import { DatabaseModule } from '../storages/db/database.module';
import { DatabaseCacheModule } from '../storages/cache/cache.module';

import { AuthService } from '@app/service/notAuthenticated/auth.service';
import { CreateUserService } from '@app/service/notAuthenticated/createUser.service';
import { DeleteUserService } from '@app/service/authenticated/deleteUser.service';
import { GetUserService } from '@app/service/notAuthenticated/getUser.service';
import { UpdateUserService } from '@app/service/authenticated/updateUser.service';
import { UploadImageService } from '@app/service/authenticated/uploadImage.service';
import { ValidateAccountService } from '@app/service/notAuthenticated/validateAccount.service';
import { LaunchOTPService } from '@app/service/notAuthenticated/launchOTP.service';
import { ForgotPasswordService } from '@app/service/notAuthenticated/forgotPassword.service';
import { FinishForgotPasswordService } from '@app/service/notAuthenticated/finishForgotPasswordProcess.service';
import { RefreshTokenService } from '@app/service/authenticated/refreshToken.service';
import { SearchUserManager } from '../storages/search/searchUserManager.service';
import { CheckFingerprintService } from '@app/service/notAuthenticated/checkFingerprint.service';
import { GenTokensService } from '@src/app/service/notAuthenticated/genTokens.service';
import { CancelCreationService } from '@src/app/service/notAuthenticated/cancelCreation.service';

import { GetUserController } from './controllers/users/notAuthenticated/get.controller';
import { CreateUserController } from './controllers/users/notAuthenticated/create.controller';
import { DeleteUserController } from './controllers/users/authenticated/delete.controller';
import { LoginController } from './controllers/users/notAuthenticated/login.controller';
import { UpdateUserContentController } from './controllers/users/authenticated/updateContent.controller';
import { UpdateUserImageController } from './controllers/users/authenticated/updateImage.controller';
import { ValidateUserController } from './controllers/users/notAuthenticated/validate.controller';
import { LaunchOTPController } from './controllers/users/notAuthenticated/launchOTP.controller';
import { RefreshTokenController } from './controllers/users/authenticated/refreshToken.controller';
import { ForgotPasswordController } from './controllers/users/notAuthenticated/forgotPassword.controller';
import { FinishForgotPasswordController } from './controllers/users/notAuthenticated/finishForgotPassword.controller';
import { ThrowTFAController } from './controllers/users/notAuthenticated/throwTFA.controller';
import { CancelCreationController } from './controllers/users/notAuthenticated/cancelCreation.controller';

import { CreateUserBody } from './dto/createUserBody';
import { LoginUserBody } from './dto/loginUser';
import { LifeController } from './controllers/life.controller';

@Module({
  imports: [
    DatabaseCacheModule,
    DatabaseModule,
    AuthModule,
    AdaptersModule,
    ApiModule,
  ],
  controllers: [
    LifeController,
    CreateUserController,
    DeleteUserController,
    GetUserController,
    ThrowTFAController,
    LoginController,
    UpdateUserContentController,
    UpdateUserImageController,
    ForgotPasswordController,
    FinishForgotPasswordController,
    ValidateUserController,
    LaunchOTPController,
    RefreshTokenController,
    CancelCreationController,
  ],
  providers: [
    CreateUserBody,
    AuthService,
    LoginUserBody,
    CreateUserService,
    GetUserService,
    DeleteUserService,
    UpdateUserService,
    ForgotPasswordService,
    FinishForgotPasswordService,
    ValidateAccountService,
    UploadImageService,
    LaunchOTPService,
    JwtService,
    RefreshTokenService,
    CheckFingerprintService,
    SearchUserManager,
    GenTokensService,
    CancelCreationService,
  ],
})
export class HttpModule {}
