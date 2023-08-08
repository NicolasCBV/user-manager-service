import { z } from 'zod';
import { createDefaultEnvOnThrowTFAE2E } from './environment';
import { getThrowTFAModuleE2E, IThrowTFAModReturn } from './getModule';

describe('Throw TFA E2E test', () => {
  const expectedResponseErr = z.object({
    statusCode: z.number(),
    message: z.string(),
  });

  let deps: IThrowTFAModReturn;

  beforeAll(async () => {
    deps = await getThrowTFAModuleE2E();
  });

  afterAll(async () => {
    await deps.app.close();
  });

  it('should be able to throw TFA', async () => {
    const res = await createDefaultEnvOnThrowTFAE2E({
      shouldCreateContent: true,
      ...deps,
    });
    expect(res.status).toBe(200);
  });

  it('throw one error: user does not exist', async () => {
    const res = await createDefaultEnvOnThrowTFAE2E({
      shouldCreateContent: false,
      ...deps,
    });
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  });

  it('throw one error: wrong password', async () => {
    const res = await createDefaultEnvOnThrowTFAE2E({
      shouldCreateContent: true,
      passwordInput: 'wrong password',
      ...deps,
    });
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  });
});
