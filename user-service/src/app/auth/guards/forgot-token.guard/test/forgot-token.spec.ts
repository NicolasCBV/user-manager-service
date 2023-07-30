import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { JwtService } from '@nestjs/jwt';
import { tokenFactory } from '@test/fatories/jwtToken';
import { createDefaultSituationOnForgotTokenGuard } from './environment';
import { UnauthorizedException } from '@nestjs/common';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';

jest.mock('@nestjs/jwt');

describe('Forgot token guard test', () => {
  const token = tokenFactory({
    type: 'forgot_token',
  });

  beforeEach(() => {
    JwtService.prototype.verifyAsync = jest.fn(async (): Promise<any> => token);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should resolve forgot-token guard', async () => {
    const { exec } = await createDefaultSituationOnForgotTokenGuard(
      token,
      `Bearer ${token.sub}`,
    );
    expect(await exec()).toBeTruthy();
  });

  it('should throw one error: token does not exist', async () => {
    JwtService.prototype.verifyAsync = jest.fn(async (): Promise<any> => {
      throw new UnauthorizedException();
    });
    const { exec } = await createDefaultSituationOnForgotTokenGuard(
      token,
      `Bearer ${token.sub}`,
    );
    expect(exec).rejects.toThrowError(UnauthorizedException);
  });

  it('should throw one error: token id not inserted', async () => {
    const { exec } = await createDefaultSituationOnForgotTokenGuard(token);
    expect(exec).rejects.toThrowError(UnauthorizedException);
  });

  it('should throw one error: token does not exist', async () => {
    TokenHandlerContract.prototype.sendToken = jest.fn();
    const { exec } = await createDefaultSituationOnForgotTokenGuard(token);
    expect(exec).rejects.toThrowError(UnauthorizedException);
  });
});
