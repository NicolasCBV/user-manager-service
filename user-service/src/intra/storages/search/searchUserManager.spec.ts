import { UserInCache } from '@src/app/entities/userInCache/userInCache';
import { userFactory } from '@test/fatories/user';
import { InMemmoryUser } from '@test/inMemmoryDatabases/user';
import { UserHandler } from '../cache/redis/handlers/user/userHandler';
import { redisClient } from '../cache/redis/redisClient';
import { SearchUserManager } from './searchUserManager.service';

const userHandler = new UserHandler();

describe('Search user manager tests', () => {
  afterEach(async () => {
    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be able to get users on database', async () => {
    const userRepo = new InMemmoryUser();

    const user = userFactory();

    userRepo.users.push(user);

    const searchUserManager = new SearchUserManager(userHandler, userRepo);

    const nonexistent = await userHandler.getUser(user.email.value);
    expect(nonexistent).toBeNull();

    const response = await searchUserManager.exec(user.email.value);

    expect(response).toBeInstanceOf(UserInCache);
  });

  it('should be able to get users on cache', async () => {
    const userRepo = new InMemmoryUser();

    const user = new UserInCache(userFactory());

    await userHandler.sendUser(user, 10000);

    const searchUserManager = new SearchUserManager(userHandler, userRepo);

    const response = await searchUserManager.exec(user.email.value);

    expect(response).toBeInstanceOf(UserInCache);
  });

  it('should be able to throw an error', async () => {
    const userRepo = new InMemmoryUser();

    const user = userFactory();

    const searchUserManager = new SearchUserManager(userHandler, userRepo);

    expect(searchUserManager.exec(user.email.value)).rejects.toThrow();
  });
});
