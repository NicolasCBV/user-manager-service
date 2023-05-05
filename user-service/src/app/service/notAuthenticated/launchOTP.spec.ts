import { BcryptAdapter } from '@src/app/adapters/bcrypt/bcryptAdapter';
import { NodemailerAdapter } from '@src/app/adapters/nodemailer/nodemailerAdapter';
import { OTP } from '@src/app/entities/OTP/_OTP';
import { Email } from '@src/app/entities/user/email';
import { OTPHandler } from '@src/intra/storages/cache/redis/handlers/OTP/OTPHandler';
import { UserHandler } from '@src/intra/storages/cache/redis/handlers/user/userHandler';
import { redisClient } from '@src/intra/storages/cache/redis/redisClient';
import { SearchUserManager } from '@src/intra/storages/search/searchUserManager.service';
import { OTPFactory } from '@test/fatories/OTP';
import { userInCacheFactory } from '@test/fatories/userInCache';
import { InMemmoryUser } from '@test/inMemmoryDatabases/user';
import { LaunchOTPService } from './launchOTP.service';

jest.spyOn(NodemailerAdapter.prototype, 'send').mockImplementation();

const userRepo = new InMemmoryUser();
const bcryptAdapter = new BcryptAdapter();
const mailtrap = new NodemailerAdapter();
const userHandler = new UserHandler();
const otpHandler = new OTPHandler();

const searchUser = new SearchUserManager(
 userHandler,
 userRepo
);

describe('Launch OTP test', () => {
  afterEach(async () => {
    jest.resetAllMocks();

    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be able to launch OTP', async () => {
    const user = userInCacheFactory();
    const otp = OTPFactory({
      createdAt: new Date(Date.now() - 1000 * 30),
    });

    await userHandler.sendUser(user, 10000);
    await otpHandler.sendOTP(otp, user.email.value);

    const launchOTPService = new LaunchOTPService(
      userRepo,
      searchUser,
      bcryptAdapter,
      mailtrap,
      userHandler,
      otpHandler,
    );

    await launchOTPService.exec(user.email.value);

    const existentOTP = await otpHandler.getOTP(user.email.value);

    expect(existentOTP).toBeInstanceOf(OTP);
  });

  it('should throw an error: minimal time not reached', async () => {
    const newUser = userInCacheFactory({
      email: new Email('user email'),
      cachedAt: new Date(),
    });
    await userHandler.sendUser(newUser, 10000);

    const launchOTPService = new LaunchOTPService(
      userRepo,
      searchUser,
      bcryptAdapter,
      mailtrap,
      userHandler,
      otpHandler,
    );

    expect(launchOTPService.exec(newUser.email.value)).rejects.toThrow();
  });

  it('should throw an error: max time reached', async () => {
    const timeToExpire = Number(process.env.OTP_TIME);

    const newUser = userInCacheFactory({
      email: new Email('user email'),
      cachedAt: new Date(Date.now() - timeToExpire),
    });
    await userHandler.sendUser(newUser, 10000);

    const launchOTPService = new LaunchOTPService(
      userRepo,
      searchUser,
      bcryptAdapter,
      mailtrap,
      userHandler,
      otpHandler,
    );

    expect(launchOTPService.exec(newUser.email.value)).rejects.toThrow();
  });
});
