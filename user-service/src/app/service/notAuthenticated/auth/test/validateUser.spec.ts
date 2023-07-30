import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { userFactory } from '@test/fatories/user';
import { BcryptAdapter } from '@app/adapters/bcrypt/bcryptAdapter';
import { UserInCache } from '@app/entities/userInCache/userInCache';
import { getAuthModule } from './getModule';

jest.mock('@src/app/adapters/nodemailer/nodemailerAdapter');
jest.mock('@infra/storages/search/searchUserManager.service');
jest.mock('@app/adapters/bcrypt/bcryptAdapter');

describe('Auth validate user method tests', () => {
  afterEach(async () => {
    jest.resetAllMocks();

    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should authenticate user', async () => {
    const user = userFactory();
    SearchUserManager.prototype.exec = jest.fn(
      async () => new UserInCache(user),
    );
    BcryptAdapter.prototype.compare = jest.fn(async () => true);

    const { authService } = await getAuthModule();

    const validateResult = await authService.validateUser({
      email: user.email.value,
      password: user.password.value,
    });

    expect(validateResult).toEqual('OK');
  });

  it('should return null', async () => {
    const user = userFactory();
    SearchUserManager.prototype.exec = jest.fn(
      async () => new UserInCache(userFactory()),
    );
    BcryptAdapter.prototype.compare = jest.fn(async () => false);

    const { authService } = await getAuthModule();

    expect(
      await authService.validateUser({
        email: user.email.value,
        password: user.password.value,
      }),
    ).toBeNull;
  });
});
