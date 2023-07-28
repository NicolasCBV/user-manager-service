import { z } from 'zod';
import { createDefaultEnvOnLoginE2E } from './environment';
import { getAuthModuleE2E, IGetAuthModReturn } from './getModules';

describe('Login E2E test', () => {
  const expectedResponseErr = z.object({
    statusCode: z.number(),
    message: z.string(),
  });

  let deps: IGetAuthModReturn;

  beforeAll(async () => {
    deps = await getAuthModuleE2E();
  });

  afterAll(async () => {
    await deps.app.close();
  });

  it('should be able to authenticate user', async () => {
    const res = await createDefaultEnvOnLoginE2E({
      shouldCreateContent: {
        shouldUseDeviceId: false,
      },
      ...deps
    });
    expect(res.status).toBe(201);
    expect(typeof res.body.access_token).toEqual('string');
    expect(
      res.headers['set-cookie']?.find((item: string) =>
        item?.includes('refresh-cookie='),
      ),
    ).toBeTruthy();
  });
  
  it('should be able to authenticate user with deviceId', async () => {
    const res = await createDefaultEnvOnLoginE2E({
      shouldCreateContent: {
        shouldUseDeviceId: true,
      },
      ...deps
    });
    expect(res.status).toBe(201);
    expect(typeof res.body.access_token).toEqual('string');
    expect(
      res.headers['set-cookie']?.find((item: string) =>
        item?.includes('refresh-cookie='),
      ),
    ).toBeTruthy();
  });
  
  it('throw one error: user does not exist', async () => {
    const res = await createDefaultEnvOnLoginE2E({ ...deps });
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  });
  
  it('throw one error: wrong code', async () => {
    const res = await createDefaultEnvOnLoginE2E({
      shouldCreateContent: {
        shouldUseDeviceId: false,
      },
      codeInput: 'wrong code',
      ...deps
    });
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  });
});
