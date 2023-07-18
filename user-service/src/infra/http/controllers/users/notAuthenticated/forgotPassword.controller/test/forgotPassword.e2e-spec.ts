import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { z } from 'zod';
import { createDefaultEnvOnForgotPasswordE2E } from './environment';

describe('Forgot password E2E test', () => {
  afterEach(async () => {
    await redisClient.flushall();
  });

  it('should be able to forgot password process', async () => {
    const res = await createDefaultEnvOnForgotPasswordE2E({
      shouldCreateContent: true,
    });
    expect(res.status).toBe(200);
  });

  it('should throw one error: user does not exist', async () => {
    const expectedResponseErr = z.object({
      statusCode: z.number(),
      message: z.string(),
    });

    const res = await createDefaultEnvOnForgotPasswordE2E({
      shouldCreateContent: false,
    });
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  });
});
