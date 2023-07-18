import { redisClient } from "@infra/storages/cache/redis/redisClient";
import { z } from 'zod';
import { createDefaultEnvOnRefreshTokenE2E } from "./environment";

describe('Refresh token E2E test', () => {
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

  it('should be able to refresh tokens', async () => {
    const { res } = await createDefaultEnvOnRefreshTokenE2E({
      shouldCreateContent: true 
    });

    expect(res.status).toBe(200);
    expect(typeof res.body.access_token).toEqual('string');
    expect(
      res.headers['set-cookie']?.find(
        (item: string) => item?.includes('refresh-cookie=')
      )
    ).toBeTruthy();
  });
  
  it('should be able refresh tokens with device id', async () => {
    const { res } = await createDefaultEnvOnRefreshTokenE2E({
      shouldCreateContent: {
        deviceIdOutput: 'device id',
        deviceIdInput: 'device id'
      }
    });
  
    expect(res.status).toBe(200);
    expect(typeof res.body.access_token).toEqual('string');
    expect(
      res.headers['set-cookie']?.find(
        (item: string) => item?.includes('refresh-cookie=')
      )
    ).toBeTruthy();
  });
  
  it('should throw one error: wrong device id', async () => {
    const { res } = await createDefaultEnvOnRefreshTokenE2E({
      shouldCreateContent: {
        deviceIdOutput: 'device id',
        deviceIdInput: 'wrong device id'
      }
    });
  
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy()
  });
  
  it('should throw one error: user does not exist', async () => {
    const { res } = await createDefaultEnvOnRefreshTokenE2E({
      shouldCreateContent: {
        onlyTokens: true
      } 
    });
  
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy()
  });
});

