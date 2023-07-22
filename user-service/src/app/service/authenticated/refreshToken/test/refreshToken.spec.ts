import { BcryptAdapter } from '@root/src/app/adapters/bcrypt/bcryptAdapter';
import { IDefaultPropsJwt } from '@root/src/app/auth/jwt.core';
import { UserInCache } from '@root/src/app/entities/userInCache/userInCache';
import { TokenHandler } from '@root/src/infra/storages/cache/redis/handlers/token/tokenHandler';
import { redisClient } from '@root/src/infra/storages/cache/redis/redisClient';
import { SearchUserManager } from '@root/src/infra/storages/search/searchUserManager.service';
import { userFactory } from '@root/test/fatories/user';
import { GenTokensService } from '@app/service/notAuthenticated/genTokens.service';
import { getRefreshTokenModule } from './getModule';

jest.mock('@app/adapters/bcrypt/bcryptAdapter');
jest.mock('@nestjs/jwt');
jest.mock('@app/service/notAuthenticated/genTokens.service');
jest.mock('@infra/storages/search/searchUserManager.service');

describe('Refresh token test', () => {
  afterEach(async () => {
    jest.resetAllMocks();

    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be able to make tokens of refresh type', async () => {
    GenTokensService.prototype.exec = jest.fn(() => ({
      access_token: 'access_token',
      refresh_token: 'refresh_token',
    }));
    BcryptAdapter.prototype.compare = jest.fn(async () => true);
    const tokenHandlerMock = jest.spyOn(
      TokenHandler.prototype,
      'throwMainAuthTokens',
    );

    const user = userFactory();
    SearchUserManager.prototype.exec = jest.fn(
      async () => new UserInCache(user),
    );
    const { refreshToken } = await getRefreshTokenModule();

    const fakeRefreshToken: IDefaultPropsJwt = {
      sub: user.id,
      email: user.email.value,
      type: 'refresh_token',
      exp: Date.now() + 10000,
      iat: Date.now(),
    };

    const { access_token, refresh_token } = await refreshToken.exec({
      tokenData: fakeRefreshToken,
    });

    expect(tokenHandlerMock).toHaveBeenCalled();
    expect(access_token).toEqual('access_token');
    expect(refresh_token).toEqual('refresh_token');
  });
});
