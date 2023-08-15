import { OTP } from '@src/app/entities/OTP/_OTP';
import { User } from '@src/app/entities/user/_user';
import { UserInCache } from '@src/app/entities/userInCache/userInCache';
import { UserOnCache } from '@src/app/mappers/UserOnCache';
import { DefaultHandlerParams } from '../redis/handlers';

export interface UserNewContent {
  name?: string;
  description?: string;
  imageUrl?: string | null;
}

export abstract class UserHandlerContract extends DefaultHandlerParams {
  abstract sendUser(user: UserInCache, TTL: string | number): Promise<void>;
  abstract forceUpdate(
    oldUser: UserInCache | User,
    user: UserInCache,
    ttl: string | number,
  ): Promise<void>;

  abstract getUser(email: string): Promise<UserInCache | null>;
  abstract sendOTPForUser(
    user: UserInCache,
    TTL: number,
    otp: OTP,
    cancelKeyOTP: OTP,
  ): Promise<void>;
  abstract resendOTPForUser(
    email: string,
    name: string,
    TTL: number,
    newOTP: OTP,
    cancelKeyOTP?: OTP,
    isLoging?: boolean
  ): Promise<void>;
  abstract existUser(email: string, name: string): Promise<boolean>;
  abstract updateTTL(user: UserOnCache, TTL: string | number): Promise<void>;
}
