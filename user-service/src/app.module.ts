import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AdaptersModule } from './app/adapters/adapters.module';
import { AuthModule } from './app/auth/auth.module';
import { DatabaseCacheModule } from './intra/storages/cache/cache.module';
import { DatabaseModule } from './intra/storages/db/database.module';
import { HttpModule } from './intra/http/http.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      limit: 6,
      ttl: 2
    }),
    DatabaseCacheModule,
    DatabaseModule,
    AuthModule,
    HttpModule,
    AdaptersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ]
})
export class AppModule {}
