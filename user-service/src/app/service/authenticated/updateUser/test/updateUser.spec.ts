import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { Description } from '@root/src/app/entities/user/description';
import { Name } from '@root/src/app/entities/user/name';
import { userFactory } from '@test/fatories/user';
import { getUpdateUserModule } from './getModule';

describe('Update user test', () => {
  afterEach(async () => {
    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be able to test the update name & description method', async () => {
    const user = userFactory({
      name: new Name('old name'),
      description: new Description('old description'),
    });

    const { updateUser, ...dependencies } = await getUpdateUserModule();
    await dependencies.userRepo.create(user);

    await updateUser.exec({
      id: user.id,
      name: 'new name',
      description: 'new description',
    });

    const newUser = await dependencies.userRepo.find({
      email: user.email.value,
    });
    const newUserInCache = await dependencies.userHandler.getUser(
      user.email.value,
    );

    expect(newUser?.name.value).toEqual('new name');
    expect(newUser?.description?.value).toEqual('new description');
    expect(newUserInCache?.name.value).toEqual('new name');
    expect(newUserInCache?.description?.value).toEqual('new description');
  });

  it("should throw and error: user doesn't exist", async () => {
    const { updateUser } = await getUpdateUserModule();

    const user = userFactory();

    expect(
      updateUser.exec({
        id: user.id,
        name: 'new name',
        description: 'new description',
      }),
    ).rejects.toThrow();
  });
});
