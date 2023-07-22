import { UserHandler } from '@infra/storages/cache/redis/handlers/user/userHandler';
import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { InMemmoryUser } from '@test/inMemmoryDatabases/user';
import { createDefaultSituationOnUploadImage } from './environment';

jest.mock('@infra/api/firebase');

describe('Upload image tests', () => {
  afterEach(async () => {
    jest.resetAllMocks();

    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be able to upload an image', async () => {
    const { exec, dependencies, user } =
      await createDefaultSituationOnUploadImage();

    await exec();
    const existentUser = await dependencies.userHandler.getUser(
      user.email.value,
    );
    expect(typeof existentUser?.imageUrl).toEqual('string');
  });

  it("should throw an error: user doesn't exist", async () => {
    UserHandler.prototype.sendUser = jest.fn();
    InMemmoryUser.prototype.create = jest.fn();

    const { exec } = await createDefaultSituationOnUploadImage();

    expect(exec()).rejects.toThrow();
  });
});
