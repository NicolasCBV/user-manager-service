import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { userFactory } from '@test/fatories/user';
import { BcryptAdapter } from '@app/adapters/bcrypt/bcryptAdapter';
import { UserInCache } from '@app/entities/userInCache/userInCache';
import { OTPFactory } from '@root/test/fatories/OTP';
import { GenTokensService } from '@app/service/notAuthenticated/genTokens.service';
import { getAuthModule } from './getModule';

jest.mock('@app/service/notAuthenticated/genTokens.service');
jest.mock('@src/app/adapters/nodemailer/nodemailerAdapter');
jest.mock('@infra/storages/search/searchUserManager.service');
jest.mock('@app/adapters/bcrypt/bcryptAdapter');

describe('Auth validate user method tests', () => {
  beforeEach(() => {
    GenTokensService.prototype.exec = jest.fn(() => ({
      access_token: 'access_token',
      refresh_token: 'refresh_token',
    }));
  });

  afterEach(async () => {
    jest.resetAllMocks();

    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should authenticate user', async () => {
    const user = userFactory();
    const otp = OTPFactory({
      userIdentificator: user.id,
    });
    SearchUserManager.prototype.exec = jest.fn(
      async () => new UserInCache(user),
    );
    BcryptAdapter.prototype.compare = jest.fn(async () => true);

    const { authService, ...dependencies } = await getAuthModule();
    await dependencies.otpHandler.sendOTP(otp, user.email.value, true);

    const validateResult = await authService.login({
      userEmail: user.email.value,
      code: otp.code,
    });

    expect(validateResult.access_token).toEqual('access_token');
    expect(validateResult.refresh_token).toEqual('refresh_token');
  });

  it('should throw one error: OTP does not exist', async () => {
    const user = userFactory();
    SearchUserManager.prototype.exec = jest.fn(
      async () => new UserInCache(user),
    );

    const { authService } = await getAuthModule();

    expect(
      authService.login({
        userEmail: user.email.value,
        code: 'fake code',
      }),
    ).rejects.toThrow();
  });

  it('should throw one error: wrong code', async () => {
    const user = userFactory();
    const otp = OTPFactory({
      userIdentificator: user.id,
    });
    SearchUserManager.prototype.exec = jest.fn(
      async () => new UserInCache(user),
    );
    BcryptAdapter.prototype.compare = jest.fn(async () => false);

    const { authService, ...dependencies } = await getAuthModule();
    await dependencies.otpHandler.sendOTP(otp, user.email.value, true);

    expect(
      authService.login({
        userEmail: user.email.value,
        code: 'wrong code',
      }),
    ).rejects.toThrow();
  });
});
