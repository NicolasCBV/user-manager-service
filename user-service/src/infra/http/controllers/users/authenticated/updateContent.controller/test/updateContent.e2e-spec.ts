import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { z } from 'zod';
import { createDefaultEnvOnUpdateContentE2E } from './environment';

describe('Update user content E2E test', () => {
  const expectedResponseErr = z.object({
    statusCode: z.number(),
    message: z.string(),
  });

  afterEach(async () => {
    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be able to update user content', async () => {
    const { res, dependencies, user } =
      await createDefaultEnvOnUpdateContentE2E({
        shouldCreateContent: true,
      });
    const userOnDB = await dependencies.userRepo.find({
      id: user.id,
    });

    expect(res.status).toBe(200);
    expect(userOnDB?.name.value).toEqual('John Doe');
    expect(userOnDB?.description?.value).toEqual('New description');
  });

  it('should be able to update user content with device id', async () => {
    const { res, dependencies, user } =
      await createDefaultEnvOnUpdateContentE2E({
        shouldCreateContent: {
          deviceIdOutput: 'device id',
          deviceIdInput: 'device id',
        },
      });
    const userOnDB = await dependencies.userRepo.find({
      id: user.id,
    });

    expect(res.status).toBe(200);
    expect(userOnDB?.name.value).toEqual('John Doe');
    expect(userOnDB?.description?.value).toEqual('New description');
  });

  it('should throw one error: wrong device id', async () => {
    const { res } = await createDefaultEnvOnUpdateContentE2E({
      shouldCreateContent: {
        deviceIdOutput: 'device id',
        deviceIdInput: 'wrong device id',
      },
    });

    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
  });

  it('should throw one error: user does not exist', async () => {
    const { res } = await createDefaultEnvOnUpdateContentE2E({
      shouldCreateContent: false,
    });

    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
  });
});
