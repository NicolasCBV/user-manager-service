import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { UserInCache } from '@app/entities/userInCache/userInCache';
import { userFactory } from '@test/fatories/user';
import { getDeleteUserModule } from './getModule';

jest.mock('@infra/api/firebase');

describe('Delete user test', () => {
  afterEach(async () => {
    jest.resetAllMocks();

    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be able to delete user', async () => {
    const { deleteUser, ...dependencies } = await getDeleteUserModule();

    const user = userFactory();
    await dependencies.userRepo.create(user);
    await dependencies.userHandler.sendUser(new UserInCache(user), 10000);

    await deleteUser.exec({
      id: user.id,
      email: user.email.value,
    });

    const nonexistentUser = await dependencies.userRepo.find({
      email: user.email.value,
    });
    const nonexistentUserOnCache = await dependencies.userHandler.existUser(
      user.email.value,
      user.name.value,
    );
    expect(nonexistentUser).toBeNull();
    expect(nonexistentUserOnCache).toBeFalsy();
  });

  it("should throw one error: user doesn't exist", async () => {
    const { deleteUser } = await getDeleteUserModule();
    const user = userFactory();

    expect(
      deleteUser.exec({
        id: user.id,
        email: user.email.value,
      }),
    ).rejects.toThrow();
  });
});
