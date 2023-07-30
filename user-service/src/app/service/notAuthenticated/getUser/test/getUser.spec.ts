import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { UserInCache } from '@root/src/app/entities/userInCache/userInCache';
import { userFactory } from '@test/fatories/user';
import { getModuleOfGetUser } from './getModule';

jest.mock('@infra/storages/search/searchUserManager.service');

describe('Get user tests', () => {
  afterEach(async () => {
    jest.resetAllMocks();

    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be able to find user', async () => {
    const user = userFactory();
    SearchUserManager.prototype.exec = jest.fn(
      async () => new UserInCache(user),
    );
    const { getUser } = await getModuleOfGetUser();

    const userToFind = await getUser.exec({ email: user.email.value });

    expect(userToFind).toBeTruthy();
  });
});
