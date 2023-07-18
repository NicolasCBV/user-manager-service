import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '@service/notAuthenticated/auth/auth.service';
import { CancelCreationService } from '@service/notAuthenticated/cancelCreation/cancelCreation.service';
import { CreateUserService } from '@service/notAuthenticated/createUser/createUser.service';
import { FinishForgotPasswordService } from '@service/notAuthenticated/finishForgotPassword/finishForgotPassword.service';
import { ForgotPasswordService } from '@service/notAuthenticated/forgotPassword/forgotPassword.service';
import { GetUserService } from '@service/notAuthenticated/getUser/getUser.service';
import { RelaunchOTPService } from '@service/notAuthenticated/relaunchOTP/relaunchOTP.service';
import { ValidateAccountService } from '@service/notAuthenticated/validateAccount/validateAccount.service';
import { GenTokensService } from '@service/notAuthenticated/genTokens.service';

import { CancelCreationController } from './cancelCreation.controller';
import { CreateUserController } from './create.controller';
import { ForgotPasswordController } from './forgotPassword.controller';
import { FinishForgotPasswordController } from './finishForgotPassword.controller';
import { GetUserController } from './get.controller';
import { LoginController } from './login.controller';
import { RelaunchOTPController } from './relaunchOTP.controller';
import { ThrowTFAController } from './throwTFA.controller';
import { ValidateUserController } from './validate.controller';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';

import { DatabaseModule } from '@infra/storages/db/database.module';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { AdaptersModule } from '@app/adapters/adapters.module';
import { AuthModule } from '@app/auth/auth.module';

@Module({
  imports: [
    AuthModule, 
    DatabaseModule, 
    DatabaseCacheModule, 
    AdaptersModule
  ],
  controllers: [
    GetUserController,
    CancelCreationController,
    CreateUserController,
    FinishForgotPasswordController,
    ForgotPasswordController,
    LoginController,
    RelaunchOTPController,
    ThrowTFAController,
    ValidateUserController,
  ],
  providers: [
    GenTokensService,
    JwtService,
    GetUserService,
    CancelCreationService,
    CreateUserService,
    FinishForgotPasswordService,
    ForgotPasswordService,
    AuthService,
    RelaunchOTPService,
    ValidateAccountService,
    SearchUserManager,
  ],
})
export class NonAuthUsersRoutesModule {}
