import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { z } from 'zod';
import { createDefaultEnvOnThrowTFAE2E } from './environment';

describe('Throw TFA E2E test', () => {
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

  it('should be able to throw TFA', async () => {
    const res = await createDefaultEnvOnThrowTFAE2E({
      shouldCreateContent: true,
    });
    expect(res.status).toBe(200);
  });

  it('throw one error: user does not exist', async () => {
    const res = await createDefaultEnvOnThrowTFAE2E({
      shouldCreateContent: false,
    });
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  });

  it('throw one error: wrong password', async () => {
    const res = await createDefaultEnvOnThrowTFAE2E({
      shouldCreateContent: true,
      passwordInput: 'wrong password',
    });
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  });
});
