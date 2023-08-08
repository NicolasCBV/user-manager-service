import { z } from 'zod';
import { createDefaultEnvOnForgotPasswordE2E } from './environment';
import {
  getForgotPasswordModuleE2E,
  IForgotPasswordModReturn,
} from './getModule';

describe('Forgot password E2E test', () => {
  let deps: IForgotPasswordModReturn;

  beforeAll(async () => {
    deps = await getForgotPasswordModuleE2E();
  });

  afterAll(async () => {
    await deps.app.close();
  });

  it('should be able to forgot password process', async () => {
    const res = await createDefaultEnvOnForgotPasswordE2E({
      shouldCreateContent: true,
      ...deps,
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
      ...deps,
    });
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  });
});
