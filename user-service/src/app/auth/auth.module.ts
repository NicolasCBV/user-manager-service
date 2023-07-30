import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { AdaptersModule } from '@app/adapters/adapters.module';
import { AuthService } from '@app/service/notAuthenticated/auth/auth.service';
import { GenTokensService } from '@app/service/notAuthenticated/genTokens.service';
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
  providers: [GenTokensService, AuthService, JwtStrategy, SearchUserManager],
  exports: [AuthService],
})
export class AuthModule {}
