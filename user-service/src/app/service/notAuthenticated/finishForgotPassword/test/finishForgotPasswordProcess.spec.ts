import { BcryptAdapter } from '@src/app/adapters/bcrypt/bcryptAdapter';
import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { createDefaultSituationOnFFPServ } from './environment';
import { InMemmoryUser } from '@root/test/inMemmoryDatabases/user';

jest.mock('@infra/storages/search/searchUserManager.service');
jest.mock('@app/adapters/bcrypt/bcryptAdapter');

describe('Finish forgot password process test', () => {
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

  it('should be able to finish the forgot password process', async () => {
    const { exec, user, dependencies } =
      await createDefaultSituationOnFFPServ();
    await exec();

    const existentUserInCache = await dependencies.userHandler.getUser(
      user.email.value,
    );

    expect(existentUserInCache?.password.value).toEqual('hashed');
  });

  it('should throw one error: user does not exist on repo', async () => {
    InMemmoryUser.prototype.create = jest.fn();

    const { exec } = await createDefaultSituationOnFFPServ();

    expect(exec()).rejects.toThrow();
  });
});
