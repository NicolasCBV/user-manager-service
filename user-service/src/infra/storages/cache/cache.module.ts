import { Module } from '@nestjs/common';
import { MiscellaneousHandlerContract } from './contract/miscellaneousHandler';
import { OTPHandlerContract } from './contract/OTPHandler';
import { TokenHandlerContract } from './contract/tokenHandler';
import { UserHandlerContract } from './contract/userHandler';
import { MiscellaneousHandler } from './redis/handlers/misc/miscellaneousHandler';
import { OTPHandler } from './redis/handlers/OTP/OTPHandler';
import { TokenHandler } from './redis/handlers/token/tokenHandler';
import { UserHandler } from './redis/handlers/user/userHandler';
import { RedisService } from './redis/redis.service';
import { redisClient } from './redis/redisClient';

@Module({
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      useValue: new RedisService(redisClient),
    },
    {
      provide: TokenHandlerContract,
      useClass: TokenHandler,
    },
    {
      provide: UserHandlerContract,
      useClass: UserHandler,
    },
    {
      provide: OTPHandlerContract,
      useClass: OTPHandler,
    },
    {
      provide: MiscellaneousHandlerContract,
      useClass: MiscellaneousHandler,
    },
  ],
  exports: [
    TokenHandlerContract,
    UserHandlerContract,
    OTPHandlerContract,
    MiscellaneousHandlerContract,
  ],
})
export class DatabaseCacheModule {}
