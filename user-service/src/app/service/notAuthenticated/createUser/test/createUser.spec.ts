import { userFactory } from '@test/fatories/user';
import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { OTP } from '@app/entities/OTP/_OTP';
import { BcryptAdapter } from '@app/adapters/bcrypt/bcryptAdapter';
import { UserInCache } from '@app/entities/userInCache/userInCache';
import { getCreateUserModule } from './getModule';

jest.mock('@app/adapters/nodemailer/nodemailerAdapter');
jest.mock('@app/adapters/bcrypt/bcryptAdapter');

describe('Create user tests', () => {
  beforeEach(() => {
    BcryptAdapter.prototype.hash = jest.fn(async () => 'hashed');
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should create user', async () => {
    const { createUserService, ...dependencies } = await getCreateUserModule();

    const user = new UserInCache(userFactory());
    const res = await createUserService.exec({
      name: user.name.value,
      email: user.email.value,
      password: user.password.value,
    });

    const existentUser = await dependencies.userHandler.getUser(
      user.email.value,
    );
    const existentOTP = await dependencies.otpHandler.getOTP(user.email.value);
    const existentCancelKeyOTP = await dependencies.otpHandler.getCancelKeyOTP(
      user.email.value,
    );

    expect(typeof res).toEqual('string');
    expect(existentUser?.name.value).toEqual(user.name.value);
    expect(existentUser?.email.value).toEqual(user.email.value);
    expect(existentOTP).toBeInstanceOf(OTP);
    expect(existentCancelKeyOTP).toBeInstanceOf(OTP);
  });

  it('should throw one error - user already created in database', async () => {
    const { createUserService, ...dependencies } = await getCreateUserModule();

    const user = new UserInCache(userFactory());
    await dependencies.userRepo.create(user);

    expect(
      createUserService.exec({
        name: user.name.value,
        email: user.email.value,
        password: user.password.value,
      }),
    ).rejects.toThrow();
  });

  it('should throw one error - user already created in cache', async () => {
    const { createUserService, ...dependencies } = await getCreateUserModule();

    const user = new UserInCache(userFactory());
    await dependencies.userHandler.sendUser(user, 10000);

    expect(
      createUserService.exec({
        name: user.name.value,
        email: user.email.value,
        password: user.password.value,
      }),
    ).rejects.toThrow();
  });
});
