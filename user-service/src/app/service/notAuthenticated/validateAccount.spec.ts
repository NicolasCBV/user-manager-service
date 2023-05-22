import { JwtService } from '@nestjs/jwt';
import { BcryptAdapter } from '@src/app/adapters/bcrypt/bcryptAdapter';
import { User } from '@src/app/entities/user/_user';
import { UserInCache } from '@src/app/entities/userInCache/userInCache';
import { MiscellaneousHandler } from '@infra/storages/cache/redis/handlers/misc/miscellaneousHandler';
import { OTPHandler } from '@infra/storages/cache/redis/handlers/OTP/OTPHandler';
import { UserHandler } from '@infra/storages/cache/redis/handlers/user/userHandler';
import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { OTPFactory } from '@test/fatories/OTP';
import { userFactory } from '@test/fatories/user';
import { InMemmoryUser } from '@test/inMemmoryDatabases/user';
import { GenTokensService } from './genTokens.service';
import { ValidateAccountService } from './validateAccount.service';

jest
  .spyOn(BcryptAdapter.prototype, 'compare')
  .mockImplementation(async () => true);

const jwt = new JwtService();
const bcrypt = new BcryptAdapter();
const userHandler = new UserHandler();
const otpHandler = new OTPHandler();
const miscHandler = new MiscellaneousHandler();
const genTokens = new GenTokensService(jwt);

describe('Validate account test', () => {
  afterEach(async () => {
    jest.resetAllMocks();

    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be able to validate user', async () => {
    const userRepo = new InMemmoryUser();
    const user = new UserInCache(userFactory());
    const otp = OTPFactory();

    await userHandler.sendUser(user, 10000);
    await otpHandler.sendOTP(otp, user.email.value);

    const validateAccountService = new ValidateAccountService(
      genTokens,
      userRepo,
      bcrypt,
      userHandler,
      otpHandler,
      miscHandler,
    );

    await validateAccountService.exec({
      email: user.email.value,
      OTP: otp.code,
    });

    const existentUser = await userRepo.find({ email: user.email.value });

    expect(existentUser).toBeInstanceOf(User);
  });

  it('should be able to throw an error: user was not storaged', async () => {
    const userRepo = new InMemmoryUser();
    const user = new UserInCache(userFactory());
    const otp = OTPFactory();

    await userHandler.sendUser(user, 10000);
    await otpHandler.sendOTP(otp, user.email.value);

    const fakeUser = userFactory();

    const validateAccountService = new ValidateAccountService(
      genTokens,
      userRepo,
      bcrypt,
      userHandler,
      otpHandler,
      miscHandler,
    );

    expect(
      validateAccountService.exec({
        email: fakeUser.email.value,
        OTP: 'nonexistent code',
      }),
    ).rejects.toThrow();
  });

  it('should be able to throw an error: wrong OTP code', async () => {
    const userRepo = new InMemmoryUser();
    const user = new UserInCache(userFactory());
    const otp = OTPFactory();

    await userHandler.sendUser(user, 10000);
    await otpHandler.sendOTP(otp, user.email.value);

    jest
      .spyOn(BcryptAdapter.prototype, 'compare')
      .mockImplementation(async () => false);

    const validateAccountService = new ValidateAccountService(
      genTokens,
      userRepo,
      bcrypt,
      userHandler,
      otpHandler,
      miscHandler,
    );

    expect(
      validateAccountService.exec({
        email: user.email.value,
        OTP: 'wrong code',
      }),
    ).rejects.toThrow();
  });
});
