import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { z } from 'zod';
import { createDefaultEnvOnCreateUserE2E } from './environment';

describe('Create user e2e test', () => {
  const expectedResponse = z.object({
    cancelKey: z.string().uuid(),
  });

  afterEach(async () => {
    await redisClient.flushall();
  });

  it('should create one user', async () => {
    const res = await createDefaultEnvOnCreateUserE2E({
      shouldCreateContentOnDB: false,
      shouldCreateContentOnCache: false,
    });

    expect(res.status).toBe(200);
    expect(expectedResponse.parse(res.body)).toBeTruthy();
  });

  it('should throw one error: user already exist on database', async () => {
    const expectedResponseErr = z.object({
      statusCode: z.number(),
      message: z.string(),
    });

    const res = await createDefaultEnvOnCreateUserE2E({
      shouldCreateContentOnDB: true,
      shouldCreateContentOnCache: false,
    });

    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  });

  it('should throw one error: user already exist on cache', async () => {
    const expectedResponseErr = z.object({
      statusCode: z.number(),
      message: z.string(),
    });
    const res = await createDefaultEnvOnCreateUserE2E({
      shouldCreateContentOnDB: false,
      shouldCreateContentOnCache: true,
    });

    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  });
});
