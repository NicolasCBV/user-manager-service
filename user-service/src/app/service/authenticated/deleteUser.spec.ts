import { FirebaseAPI } from '@src/intra/api/firebase';
import { MiscellaneousHandler } from '@src/intra/storages/cache/redis/handlers/misc/miscellaneousHandler';
import { TokenHandler } from '@src/intra/storages/cache/redis/handlers/token/tokenHandler';
import { UserHandler } from '@src/intra/storages/cache/redis/handlers/user/userHandler';
import { redisClient } from '@src/intra/storages/cache/redis/redisClient';
import { userFactory } from '@test/fatories/user';
import { InMemmoryUser } from '@test/inMemmoryDatabases/user';
import { DeleteUserService } from './deleteUser.service';

jest
  .spyOn(FirebaseAPI.prototype, 'send')
  .mockImplementation(async () => {});

const firebase = new FirebaseAPI();
const userHandler = new UserHandler();
const tokenHandler = new TokenHandler();
const miscHandler = new MiscellaneousHandler();

describe('Delete user test', () => {
  afterEach(async () => {
    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be able to delete user', async () => {
    const userRepo = new InMemmoryUser();

    const user = userFactory();
    await userRepo.create(user);
    await tokenHandler.sendToken({
      type: 'access_token',
      id: user.id,
      content: 'content',
      expiresIn: Date.now() + 10000,
    });
    await tokenHandler.sendToken({
      type: 'refresh_token',
      id: user.id,
      content: 'content',
      expiresIn: Date.now() + 10000,
    });

    const deleteUserService = new DeleteUserService(
      userRepo,
      userHandler,
      firebase,
      miscHandler,
    );

    await deleteUserService.exec(user.id, user.email.value);

    const nonexistentUser = await userRepo.find({ email: user.email.value });
    expect(nonexistentUser).toBeNull();
  });

  it("should throw an error: user doesn't exist", async () => {
    const userRepo = new InMemmoryUser();

    const user = userFactory();
    await tokenHandler.sendToken({
      type: 'access_token',
      id: user.id,
      content: 'content',
      expiresIn: Date.now() + 10000,
    });
    await tokenHandler.sendToken({
      type: 'refresh_token',
      id: user.id,
      content: 'content',
      expiresIn: Date.now() + 10000,
    });

    const deleteUserService = new DeleteUserService(
      userRepo,
      userHandler,
      firebase,
      miscHandler,
    );

    expect(deleteUserService.exec(user.id, user.email.value)).rejects.toThrow();
  });
});
