import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { createDefaultEnvOnCancelCreationE2E } from './environment';
import { z } from 'zod';

describe('Cancel user creation E2E', () => {
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

  it('should cancel user creation', async () => {
    const { res, user, userHandler } =
      await createDefaultEnvOnCancelCreationE2E({
        isCancelKeyWrong: false,
        shouldCreateContent: true,
      });

    const nonexistentUser = await userHandler.find({ id: user.id });
    expect(res.status).toBe(200);
    expect(nonexistentUser).toBeNull();
  });

  it('should throw one error: user does not exist', async () => {
    const { res } = await createDefaultEnvOnCancelCreationE2E({
      shouldCreateContent: false,
      isCancelKeyWrong: false,
    });

    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
  });
});
