import { UserHandler } from '@src/intra/storages/cache/redis/handlers/user/userHandler';
import { redisClient } from '@src/intra/storages/cache/redis/redisClient';
import { SearchUserManager } from '@src/intra/storages/search/searchUserManager.service';
import { userFactory } from '@test/fatories/user';
import { InMemmoryUser } from '@test/inMemmoryDatabases/user';
import { GetUserService } from './getUser.service';

describe('Get user tests', () => {
  afterEach(async () => {
    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });
  
  it('should be able to find user', async () => {
    const userRepo = new InMemmoryUser();
    const userHandler = new UserHandler()
    const searchUser = new SearchUserManager(
      userHandler, 
      userRepo
    );

    const user = userFactory();
    const getUserService = new GetUserService(searchUser);

    await userRepo.create(user);

    const userToFind = await getUserService.exec(user.email.value);

    expect(userToFind).toBeTruthy();
  });
});
