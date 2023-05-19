import { OTP } from '../entities/OTP/_OTP';
import { UserInCache } from '../entities/userInCache/userInCache';

export type TokenInCache = {
  type: 'refresh_token' | 'access_token' | 'forgot_token';
  id: string;
  content: string;
  expiresIn: number;
};

export interface ITokenTypes {
  refreshToken: 'refresh_token';
  accessToken: 'access_token';
  forgotToken: 'forgot_token';
}

export abstract class CacheRepo {
  abstract tokenKW: string;
  abstract tokenTypes: ITokenTypes;
  abstract userKW: string;
  abstract otpKW: string;

  abstract sendUser(user: UserInCache, ttl: string | number): Promise<void>;
  abstract existUser(email: string, name: string): Promise<boolean>;
  abstract getUser(email: string): Promise<UserInCache | null>;
  abstract resendOTPForUser(
    user: UserInCache,
    TTL: number,
    newOTP: OTP,
  ): Promise<void>;

  abstract sendToken(token: TokenInCache): Promise<void>;
  abstract refreshAllUsersToken(
    accessToken: TokenInCache,
    refreshToken: TokenInCache,
  ): Promise<void>;
  abstract getToken(
    userId: string,
    type: 'refresh_token' | 'access_token' | 'forgot_token',
  ): Promise<string | null>;

  abstract sendOTP(otp: OTP, email: string): Promise<void>;
  abstract getOTP(email: string): Promise<OTP | null>;

  abstract del(key: string): Promise<void>;
  abstract deleteAllUserDatas(email: string, name: string): Promise<void>;

  abstract exist(key: string): Promise<boolean>;
}
