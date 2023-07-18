import { redisClient } from "@infra/storages/cache/redis/redisClient";
import { randomUUID } from "crypto";
import { z } from 'zod';
import { createDefaultEnvOnFinishForgotPasswordE2E } from "./environment";

describe('Forgot password E2E test', () => {
  afterEach(async () => {
    await redisClient.flushall();
  });

  it('should be able to finish forgot password process', async () => {
    const { oldPassword, newPassword, res } = await createDefaultEnvOnFinishForgotPasswordE2E({
      shouldCreateContent: true
    }); 

    expect(res.status).toBe(200);
    expect(oldPassword).not.toEqual(newPassword);
  });

  it('should be able to finish forgot password process using device id', async () => {
    const deviceId = randomUUID();
  
    const { oldPassword, newPassword, res } = await createDefaultEnvOnFinishForgotPasswordE2E({
      shouldCreateContent: true,
      deviceIdInput: deviceId,
      deviceIdOutput: deviceId
    }); 

    expect(res.status).toBe(200);
    expect(oldPassword).not.toEqual(newPassword);
  });
  
  it('should throw one error: wrong device id', async () => {
    const deviceId = randomUUID();
  
    const { res } = await createDefaultEnvOnFinishForgotPasswordE2E({
      shouldCreateContent: true,
      deviceIdInput: 'wrong device id',
      deviceIdOutput: deviceId
    }); 
    expect(res.status).toBe(401);
  });
  
  it('should throw one error: user does not exist', async () => {
    const expectedResponseErr = z.object({
      statusCode: z.number(),
      message: z.string()
    });
  
    const { res } = await createDefaultEnvOnFinishForgotPasswordE2E({
      shouldCreateContent: false,
    }); 
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  });
})
