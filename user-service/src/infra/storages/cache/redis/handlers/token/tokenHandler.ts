import { TokenInCache } from '@src/app/repositories/cacheRepo';
import { DefaultHandlerParams } from '../';
import { TokenHandlerContract } from '../../../contract/tokenHandler';
import { redisClient } from '../../redisClient';

export class TokenHandler
  extends DefaultHandlerParams
  implements TokenHandlerContract
{
  async throwMainAuthTokens(
    sub: string,
    access_token: string,
    refresh_token: string,
  ) {
    const refresh_key = `${this.tokenKW}:refresh_token.${sub}`;
    const access_key = `${this.tokenKW}:access_token.${sub}`;

    await redisClient
      .multi()
      .set(
        access_key,
        access_token,
        'PX',
        parseInt(process.env.TOKEN_EXPIRES ?? '900000'),
      )
      .set(
        refresh_key,
        refresh_token,
        'PX',
        parseInt(process.env.REFRESH_TOKEN_EXPIRES ?? '86400000'),
      )
      .exec();
  }

  async sendToken(token: TokenInCache): Promise<void> {
    const ttl = token.expiresIn;

    const key = `${this.tokenKW}:${token.type}.${token.id}`;

    const result = await redisClient.set(key, token.content, 'PX', ttl);

    if (!result) throw this.entitieError;
  }
  async getToken(
    userId: string,
    type: 'refresh_token' | 'access_token' | 'forgot_token',
  ): Promise<string | null> {
    const token = await redisClient.get(`${this.tokenKW}:${type}.${userId}`);

    return token;
  }
  async refreshAllUsersToken(
    accessToken: TokenInCache,
    refreshToken: TokenInCache,
  ): Promise<void> {
    const refreshTokenKey = `${this.tokenKW}:${this.tokenTypes.refreshToken}.${refreshToken.id}`;
    const accessTokenKey = `${this.tokenKW}:${this.tokenTypes.accessToken}.${refreshToken.id}`;

    await redisClient
      .multi()
      .set(refreshTokenKey, refreshToken.content, 'PX', refreshToken.expiresIn)
      .set(accessTokenKey, accessToken.content, 'PX', accessToken.expiresIn)
      .exec();
  }

  async exist(
    sub: string,
    type: 'refresh_token' | 'access_token' | 'forgot_token',
  ): Promise<boolean> {
    const key = `${this.tokenKW}:${type}.${sub}`;

    const results = await redisClient.exists(key);

    return Boolean(results);
  }
}
