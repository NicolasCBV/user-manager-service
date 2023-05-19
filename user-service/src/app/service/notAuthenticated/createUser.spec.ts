import { userFactory } from '@test/fatories/user';
import { InMemmoryUser } from '@test/inMemmoryDatabases/user';
import { BcryptAdapter } from '../../adapters/bcrypt/bcryptAdapter';
import { CreateUserService } from './createUser.service';
import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { UserHandler } from '@infra/storages/cache/redis/handlers/user/userHandler';
import { OTPHandler } from '@infra/storages/cache/redis/handlers/OTP/OTPHandler';
import { NodemailerAdapter } from '@src/app/adapters/nodemailer/nodemailerAdapter';
import { UserInCache } from '@src/app/entities/userInCache/userInCache';
import { OTP } from '@src/app/entities/OTP/_OTP';
import { MiscellaneousHandler } from '@infra/storages/cache/redis/handlers/misc/miscellaneousHandler';

jest
  .spyOn(BcryptAdapter.prototype, 'hash')
  .mockImplementation(async () => 'hashed');

jest.spyOn(NodemailerAdapter.prototype, 'send').mockImplementation();

const bcrypt = new BcryptAdapter();
const email = new NodemailerAdapter();
const userHandler = new UserHandler();
const otpHandler = new OTPHandler();
const miscHandler = new MiscellaneousHandler();

describe('Create user tests', () => {
  afterEach(async () => {
    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should create user', async () => {
    const userRepo = new InMemmoryUser();
    const user = userFactory();

    const createUserService = new CreateUserService(
      userRepo,
      bcrypt,
      email,
      userHandler,
      miscHandler,
    );

    const res = await createUserService.exec({
      name: user.name.value,
      email: user.email.value,
      password: user.password.value,
    });

    const nonexistentUser = await userRepo.find({ email: user.email.value });
    const existentUser = await userHandler.getUser(user.email.value);
    const existentOTP = await otpHandler.getOTP(user.email.value);
    const existentCancelKeyOTP = await otpHandler.getCancelKeyOTP(
      user.email.value,
    );

    expect(typeof res).toEqual('string');
    expect(nonexistentUser).toBeNull();
    expect(existentUser).toBeInstanceOf(UserInCache);
    expect(existentOTP).toBeInstanceOf(OTP);
    expect(existentCancelKeyOTP).toBeInstanceOf(OTP);
  });

  it('should throw error - user already created in database', async () => {
    const userRepo = new InMemmoryUser();
    const user = userFactory();

    await userRepo.create(user);

    const createUserService = new CreateUserService(
      userRepo,
      bcrypt,
      email,
      userHandler,
      miscHandler,
    );

    expect(
      createUserService.exec({
        name: user.name.value,
        email: user.email.value,
        password: user.password.value,
      }),
    ).rejects.toThrow();
  });

  it('should throw error - user already created in cache', async () => {
    const userRepo = new InMemmoryUser();
    const user = new UserInCache(userFactory());

    await userHandler.sendUser(user, 10000);

    const createUserService = new CreateUserService(
      userRepo,
      bcrypt,
      email,
      userHandler,
      miscHandler,
    );

    expect(
      createUserService.exec({
        name: user.name.value,
        email: user.email.value,
        password: user.password.value,
      }),
    ).rejects.toThrow();
  });
});
