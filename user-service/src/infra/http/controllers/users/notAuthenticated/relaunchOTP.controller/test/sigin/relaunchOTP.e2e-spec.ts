import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { z } from 'zod';
import { createRelaunchOTPE2E } from './environment';

describe('Relaunch OTP E2E sigin test', () => {
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

  it('should be able to relaunch OTP', async () => {
    const expectedResponse = z.object({
      cancelKey: z.string(),
    });
    const res = await createRelaunchOTPE2E({
      shouldCreateContent: {},
    });
    expect(res.status).toBe(200);
    expect(expectedResponse.parse(res.body)).toBeTruthy();
  });

  it('throw one error: OTP not launched', async () => {
    const res = await createRelaunchOTPE2E({});
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  });

  it('throw one error: wrong time - to early', async () => {
    const res = await createRelaunchOTPE2E({
      shouldCreateContent: {
        time: new Date(),
      },
    });
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  });

  it('throw one error: wrong time - to late', async () => {
    const res = await createRelaunchOTPE2E({
      shouldCreateContent: {
        time: new Date(Date.now() - parseInt(process.env.OTP_TIME ?? '120000')),
      },
    });
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  });
});
