import { UserHandler } from '@infra/storages/cache/redis/handlers/user/userHandler';
import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { userFactory } from '@test/fatories/user';
import { InMemmoryUser } from '@test/inMemmoryDatabases/user';
import { UpdateUserService } from './updateUser.service';

const userHandler = new UserHandler();

describe('Update user test', () => {
  afterEach(async () => {
    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be able to test the update name & description method', async () => {
    const userRepo = new InMemmoryUser();

    const user = userFactory();
    await userRepo.create(user);

    const updateUser = new UpdateUserService(userRepo, userHandler);

    await updateUser.exec({
      id: user.id,
      name: 'new name',
      description: 'new description',
    });

    const existentUserInCache = await userHandler.getUser(user.email.value);

    expect(existentUserInCache?.name.value).toEqual('new name');
    expect(existentUserInCache?.description?.value).toEqual('new description');
  });

  it('should throw and error: insufficient length name', async () => {
    const userRepo = new InMemmoryUser();

    const user = userFactory();
    await userRepo.create(user);

    const updateUser = new UpdateUserService(userRepo, userHandler);

    expect(
      updateUser.exec({
        id: user.id,
        name: '1',
        description: 'new description',
      }),
    ).rejects.toThrow();
  });

  it('should throw and error: to large length name', async () => {
    const userRepo = new InMemmoryUser();

    const user = userFactory();
    await userRepo.create(user);

    const updateUser = new UpdateUserService(userRepo, userHandler);

    expect(
      updateUser.exec({
        id: user.id,
        name: '1'.repeat(65),
        description: 'new description',
      }),
    ).rejects.toThrow();
  });

  it('should throw and error: to insufficient length description', async () => {
    const userRepo = new InMemmoryUser();

    const user = userFactory();
    await userRepo.create(user);

    const updateUser = new UpdateUserService(userRepo, userHandler);

    expect(
      updateUser.exec({
        id: user.id,
        name: 'new name',
        description: '1',
      }),
    ).rejects.toThrow();
  });

  it('should throw and error: to large length description', async () => {
    const userRepo = new InMemmoryUser();

    const user = userFactory();
    await userRepo.create(user);

    const updateUser = new UpdateUserService(userRepo, userHandler);

    expect(
      updateUser.exec({
        id: user.id,
        name: 'new name',
        description: '1'.repeat(257),
      }),
    ).rejects.toThrow();
  });

  it("should throw and error: user doesn't exist", async () => {
    const userRepo = new InMemmoryUser();

    const user = userFactory();

    const updateUser = new UpdateUserService(userRepo, userHandler);

    expect(
      updateUser.exec({
        id: user.id,
        name: 'new name',
        description: 'new description',
      }),
    ).rejects.toThrow();
  });
});
