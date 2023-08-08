import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { JwtService } from '@nestjs/jwt';
import { CookieParserAdapter } from '@app/adapters/cookie-parser/cookieParserAdapter';
import { tokenFactory } from '@root/test/fatories/jwtToken';
import { createDefaultSituationOnRTGuard } from './environment';
import { UnauthorizedException } from '@nestjs/common';
import { TokenHandler } from '@root/src/infra/storages/cache/redis/handlers/token/tokenHandler';

jest.mock('@nestjs/jwt');
jest.mock('@app/adapters/cookie-parser/cookieParserAdapter')

describe('Refresh token guard test', () => {
  const fakeToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZWZhdWx0IGlkIiwiZW1haWwiOiJkZWZhdWx0QGVtYWlsLmNvbSIsInR5cGUiOiJyZWZyZXNoX3Rva2VuIiwiZGV2aWNlSWQiOiIkMmIkMTAkVWh1cXc4U3FsbVFRT3RXUGpPb0J5Lk1BVDMwZEsySHRmSVM3UC9iQXA4ekh5QWNXYXozdzIiLCJpYXQiOjE2ODk2MzU3NTksImV4cCI6MTY4OTcyMjE1OX0.2toUmdNhTJ_oEwTWUIxdpvKxxHFVQlG8EpYjokcF9eE.0mvJYm6b+UnBl0xjpzDfe9s5zjTCeexy33jIR4/oGI0';

  const token = tokenFactory({
    type: 'refresh_token',
  });

  beforeEach(() => {
    JwtService.prototype.verifyAsync = jest.fn(async (): Promise<any> => token);
    CookieParserAdapter.prototype.validateSignedCookie = jest.fn(() => {
      const tokenArray = fakeToken.split(".");
      tokenArray.pop();

      const token = tokenArray.join(".")
      return token;
    });
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should resolve refresh-token guard', async () => {
    const { exec } = await createDefaultSituationOnRTGuard(fakeToken, token);

    expect(await exec()).toBeTruthy();
  });

  it('should throw one error: wrong token', async () => {
    CookieParserAdapter.prototype.validateSignedCookie = jest.fn(() => false);
    const { exec } = await createDefaultSituationOnRTGuard(
      'wrong_token',
      token,
    );

    expect(exec).rejects.toThrowError(UnauthorizedException);
  });
  
  it('should throw one error: violated signature - cookie', async () => {
    CookieParserAdapter.prototype.validateSignedCookie = jest.fn(() => false);
    const { exec } = await createDefaultSituationOnRTGuard(
      'content_token',
      token,
    );
  
    expect(exec).rejects.toThrowError(UnauthorizedException);
  });
  
  it('should throw one error: violated signature - token', async () => {
    JwtService.prototype.verifyAsync = jest.fn(() => {
      throw new UnauthorizedException();
    });
    const { exec } = await createDefaultSituationOnRTGuard(
      'content_token',
      token,
    );
  
    expect(exec).rejects.toThrowError(UnauthorizedException);
  });
  
  it('should throw one error: token does not exist', async () => {
    TokenHandler.prototype.sendToken = jest.fn();
    const { exec } = await createDefaultSituationOnRTGuard(
      'content_token',
      token,
    );

    expect(exec).rejects.toThrowError(UnauthorizedException);
  });
});
