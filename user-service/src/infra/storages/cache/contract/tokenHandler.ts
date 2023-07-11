import { TokenInCache } from '@src/app/repositories/cacheRepo';
import { DefaultHandlerParams } from '../redis/handlers';

export abstract class TokenHandlerContract extends DefaultHandlerParams {
  abstract throwMainAuthTokens(
    userId: string,
    access_token: string,
    refresh_token: string,
  ): Promise<void>;
  abstract sendToken(token: TokenInCache): Promise<void>;
  abstract getToken(
    sub: string,
    type: 'refresh_token' | 'access_token' | 'forgot_token',
  ): Promise<string | null>;
  abstract refreshAllUsersToken(
    accessToken: TokenInCache,
    refreshToken: TokenInCache,
  ): Promise<void>;
  abstract exist(
    sub: string,
    type: 'refresh_token' | 'access_token' | 'forgot_token',
  ): Promise<boolean>;
}
