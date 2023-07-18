import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { z } from 'zod';
import { createDefaultEnvOnUpdateImageE2E } from './environment';

describe('Update user image E2E test', () => {
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

  it('should be able to update profile image', async () => {
    const { res, dependencies, user } = await createDefaultEnvOnUpdateImageE2E({
      shouldCreateContent: true,
    });
    const userOnDB = await dependencies.userRepo.find({
      id: user.id,
    });

    expect(res.status).toBe(200);
    expect(res.body?.url === userOnDB?.imageUrl).toBeTruthy();
    expect(typeof res.body?.url).toEqual('string');
    expect(typeof userOnDB?.imageUrl).toEqual('string');
  });

  it('should be able to update profile image with device id', async () => {
    const { res, dependencies, user } = await createDefaultEnvOnUpdateImageE2E({
      shouldCreateContent: {
        deviceIdOutput: 'device id',
        deviceIdInput: 'device id',
      },
    });
    const userOnDB = await dependencies.userRepo.find({
      id: user.id,
    });

    expect(res.status).toBe(200);
    expect(res.body?.url === userOnDB?.imageUrl).toBeTruthy();
    expect(typeof res.body?.url).toEqual('string');
    expect(typeof userOnDB?.imageUrl).toEqual('string');
  });

  it('should throw one error: wrong device id', async () => {
    const { res } = await createDefaultEnvOnUpdateImageE2E({
      shouldCreateContent: {
        deviceIdOutput: 'device id',
        deviceIdInput: 'wrong device id',
      },
    });

    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
  });

  it('should throw one error: user does not exist', async () => {
    const { res } = await createDefaultEnvOnUpdateImageE2E({
      shouldCreateContent: false,
    });

    expect(res.status).toBe(404);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
  });
});
