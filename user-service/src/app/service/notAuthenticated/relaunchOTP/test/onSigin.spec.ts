import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { BcryptAdapter } from '@app/adapters/bcrypt/bcryptAdapter';
import { UserHandler } from '@infra/storages/cache/redis/handlers/user/userHandler';
import { createDefaultSituationOnRelaunch } from './environment';

jest.mock('@app/adapters/bcrypt/bcryptAdapter');
jest.mock('@app/adapters/nodemailer/nodemailerAdapter');

describe('Launch OTP test', () => {
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

  it('should be able to re-launch OTP', async () => {
    const fakeActualTime = 1000;
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => fakeActualTime + 1000 * 30);

    const { exec } = await createDefaultSituationOnRelaunch({
      time: fakeActualTime,
    });
    expect(typeof (await exec())).toEqual('string');
  });

  it('should throw an error: user does not exist', async () => {
    const fakeActualTime = 1000;
    jest.spyOn(Date, 'now').mockImplementation(() => fakeActualTime);
    UserHandler.prototype.sendOTPForUser = jest.fn();

    const { exec } = await createDefaultSituationOnRelaunch({
      time: fakeActualTime,
    });
    expect(exec()).rejects.toThrow();
  });

  it('should throw an error: minimal time not reached', async () => {
    const fakeActualTime = 1000;
    jest.spyOn(Date, 'now').mockImplementation(() => fakeActualTime);

    const { exec } = await createDefaultSituationOnRelaunch({
      time: fakeActualTime,
    });
    expect(exec()).rejects.toThrow();
  });

  it('should throw an error: max time reached', async () => {
    const fakeActualTime = 1000;
    jest
      .spyOn(Date, 'now')
      .mockImplementation(
        () => fakeActualTime + parseInt(process.env.OTP_TIME ?? '120000') + 1,
      );

    const { exec } = await createDefaultSituationOnRelaunch({
      time: fakeActualTime,
    });
    expect(exec()).rejects.toThrow();
  });
});
