import { BcryptAdapter } from '@root/src/app/adapters/bcrypt/bcryptAdapter';
import { OTP } from '@root/src/app/entities/OTP/_OTP';
import { UserInCache } from '@root/src/app/entities/userInCache/userInCache';
import { redisClient } from '@root/src/infra/storages/cache/redis/redisClient';
import { OTPFactory } from '@root/test/fatories/OTP';
import { userFactory } from '@root/test/fatories/user';
import { getCancelCreationModule } from './getModule';

jest.mock('@app/adapters/bcrypt/bcryptAdapter');

describe('Cancel user creation test', () => {
  beforeEach(() => {
    BcryptAdapter.prototype.compare = jest.fn(async () => true);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be able to cancel user', async () => {
    const { cancelCreationService, ...dependencies } =
      await getCancelCreationModule();

    const user = userFactory();
    const otp = OTPFactory();
    const cancelKey = OTPFactory();

    await dependencies.miscHandler.startUserSigin(
      new UserInCache(user),
      otp,
      cancelKey,
    );

    expect(
      await dependencies.userHandler.existUser(
        user.email.value,
        user.name.value,
      ),
    ).toBeTruthy;
    expect(
      await dependencies.otpHandler.getOTP(user.email.value),
    ).toBeInstanceOf(OTP);

    await cancelCreationService.exec({
      cancelKey: cancelKey.code,
      email: user.email.value,
    });

    expect(
      await dependencies.userHandler.existUser(
        user.email.value,
        user.name.value,
      ),
    ).toBeFalsy;
    expect(await dependencies.otpHandler.getOTP(user.email.value)).toBeNull;
  });

  it('should throw one error: nothing of user exist', async () => {
    const { cancelCreationService } = await getCancelCreationModule();

    const user = userFactory();
    const cancelKey = OTPFactory();

    expect(
      cancelCreationService.exec({
        cancelKey: cancelKey.code,
        email: user.email.value,
      }),
    ).rejects.toThrow();
  });

  it('should throw one error: wrong cancelKey input', async () => {
    BcryptAdapter.prototype.compare = jest.fn(async () => false);

    const { cancelCreationService, ...dependencies } =
      await getCancelCreationModule();

    const user = userFactory();
    const otp = OTPFactory();
    const cancelKey = OTPFactory();

    await dependencies.miscHandler.startUserSigin(
      new UserInCache(user),
      otp,
      cancelKey,
    );

    expect(
      await dependencies.userHandler.existUser(
        user.email.value,
        user.name.value,
      ),
    ).toBeTruthy;
    expect(
      await dependencies.otpHandler.getOTP(user.email.value),
    ).toBeInstanceOf(OTP);

    expect(
      cancelCreationService.exec({
        cancelKey: 'wrong key',
        email: user.email.value,
      }),
    ).rejects.toThrow();
  });
});
