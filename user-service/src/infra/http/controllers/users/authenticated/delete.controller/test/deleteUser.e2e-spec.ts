import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { z } from 'zod';
import { createDefaultEnvOnDeleteUserE2E } from './environment';

describe('Delete user E2E test', () => {
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

  it('should be able to delete user', async () => {
    const { res, dependencies, user } = await createDefaultEnvOnDeleteUserE2E({
      shouldCreateContent: true,
    });
    const userOnDB = await dependencies.userRepo.find({
      id: user.id,
    });

    expect(res.status).toBe(200);
    expect(userOnDB).toBeNull();
  });

  it('should be able to delete user with device id', async () => {
    const { res, dependencies, user } = await createDefaultEnvOnDeleteUserE2E({
      shouldCreateContent: {
        deviceIdOutput: 'device id',
        deviceIdInput: 'device id',
      },
    });
    const userOnDB = await dependencies.userRepo.find({
      id: user.id,
    });

    expect(res.status).toBe(200);
    expect(userOnDB).toBeNull();
  });

  it('should throw one error: wrong device id', async () => {
    const { res } = await createDefaultEnvOnDeleteUserE2E({
      shouldCreateContent: {
        deviceIdOutput: 'device id',
        deviceIdInput: 'wrong device id',
      },
    });

    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
  });

  it('should throw one error: user does not exist', async () => {
    const { res } = await createDefaultEnvOnDeleteUserE2E({
      shouldCreateContent: {
        onlyTokens: true,
      },
    });

    expect(res.status).toBe(404);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
  });
});
