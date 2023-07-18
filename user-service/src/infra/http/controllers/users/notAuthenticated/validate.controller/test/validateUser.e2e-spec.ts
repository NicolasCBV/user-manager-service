import { redisClient } from "@infra/storages/cache/redis/redisClient";
import { randomUUID } from "crypto";
import { z } from 'zod';
import { createDefaultEnvOnValidateUserE2E } from "./environment";

describe('Validate user E2E test', () => {
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

  it('should be able to validate user account', async () => {
    const res = await createDefaultEnvOnValidateUserE2E({
      shouldCreateContent: true
    });
    expect(res.status).toBe(201);
    expect(typeof res.body.access_token).toEqual('string');
    expect(
      res.headers['set-cookie']?.find(
        (item: string) => item?.includes('refresh-cookie=')
      )
    ).toBeTruthy(); 
  });

  it('should be able to validate user account with devide id', async () => {
    const res = await createDefaultEnvOnValidateUserE2E({
      shouldCreateContent: true,
      deviceIdInput: randomUUID()
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
    const res = await createDefaultEnvOnValidateUserE2E({
      shouldCreateContent: false,
    });
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  })

  it('throw one error: wrong code', async () => {
    const res = await createDefaultEnvOnValidateUserE2E({
      shouldCreateContent: true,
      codeInput: '1234567'
    });
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  })
});


