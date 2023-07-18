import { redisClient } from "@infra/storages/cache/redis/redisClient";
import { z } from 'zod';
import { createDefaultEnvOnLoginE2E } from "./environment";

describe('Login E2E test', () => {
  const expectedResponseErr = z.object({
    statusCode: z.number(),
    message: z.string()
  });

  afterEach(async () => {
    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be able to authenticate user', async () => {
    const res = await createDefaultEnvOnLoginE2E({
      shouldCreateContent: {
        shouldUseDeviceId: false
      } 
    });
    expect(res.status).toBe(201);
    expect(typeof res.body.access_token).toEqual('string');
    expect(
      res.headers['set-cookie']?.find(
        (item: string) => item?.includes('refresh-cookie=')
      )
    ).toBeTruthy(); 
  });

  it('should be able to authenticate user with deviceId', async () => {
    const res = await createDefaultEnvOnLoginE2E({
      shouldCreateContent: {
        shouldUseDeviceId: true
      } 
    });
    expect(res.status).toBe(201);
    expect(typeof res.body.access_token).toEqual('string');
    expect(
      res.headers['set-cookie']?.find(
        (item: string) => item?.includes('refresh-cookie=')
      )
    ).toBeTruthy(); 
  });

  it('throw one error: user does not exist', async () => {
    const res = await createDefaultEnvOnLoginE2E({});
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  })

  it('throw one error: wrong code', async () => {
    const res = await createDefaultEnvOnLoginE2E({
      shouldCreateContent: {
        shouldUseDeviceId: false
      },
      codeInput: 'wrong code'
    });
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  })
});

