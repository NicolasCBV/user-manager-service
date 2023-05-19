import { OTP } from '@src/app/entities/OTP/_OTP';
import { UserInCache } from '@src/app/entities/userInCache/userInCache';
import { DefaultHandlerParams } from '../redis/handlers';

export abstract class MiscellaneousHandlerContract extends DefaultHandlerParams {
  abstract del(key: string): Promise<void>;
  abstract deleteAllUserDatas(
    sub: string,
    email: string,
    name: string,
  ): Promise<void>;
  abstract startUserSigin(
    user: UserInCache,
    otp: OTP,
    cancelKeyOTP: OTP,
  ): Promise<void>;
  abstract endUserSigin(
    userId: string,
    access_token: string, 
    refresh_token: string, 
    user: UserInCache,
  ): Promise<void>;
  abstract exist(key: string): Promise<boolean>;
}
