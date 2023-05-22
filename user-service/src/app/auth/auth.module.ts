import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { AdaptersModule } from '../adapters/adapters.module';
import { AuthService } from '../service/notAuthenticated/auth.service';
import { CheckFingerprintService } from '../service/notAuthenticated/checkFingerprint.service';
import { GenTokensService } from '../service/notAuthenticated/genTokens.service';
import { JwtForgotStrategy } from './jwt-forgot.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    DatabaseCacheModule,
    PassportModule,
    AdaptersModule,
    JwtModule.register({
      secret: process.env.TOKEN_SECRET as string,
    }),
  ],
  providers: [
    GenTokensService,
    AuthService,
    CheckFingerprintService,
    JwtStrategy,
    JwtForgotStrategy,
    SearchUserManager,
  ],
  exports: [AuthService],
})
export class AuthModule {}
