import { UserInCache } from '@src/app/entities/userInCache/userInCache';
import { userFactory } from '@test/fatories/user';
import { redisClient } from '../../cache/redis/redisClient';
import { getSearchUserManagerModule } from './getModule';

describe('Search user manager tests', () => {
  afterEach(async () => {
    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be able to get users on database', async () => {
    const { searchUserManager, ...dependencies } =
      await getSearchUserManagerModule();

    const user = userFactory();
    await dependencies.userRepo.create(user);

    const nonexistent = await dependencies.userHandler.getUser(
      user.email.value,
    );
    expect(nonexistent).toBeNull();

    const response = await searchUserManager.exec({ email: user.email.value });
    expect(response.isEqual(new UserInCache(user))).toBeTruthy();
  });

  it('should be able to throw an error', async () => {
    const { searchUserManager } = await getSearchUserManagerModule();

    expect(
      searchUserManager.exec({ email: 'fake@email.com' }),
    ).rejects.toThrow();
  });
});
