import { z } from 'zod';
import { getRelaunchOTPModuleE2E, IRelaunchOTPModReturn } from '../getModule';
import { createRelaunchOTPE2E } from './environment';

describe('Relaunch OTP E2E sigin test', () => {
  const expectedResponseErr = z.object({
    statusCode: z.number(),
    message: z.string(),
  });

  let deps: IRelaunchOTPModReturn;

  beforeAll(async () => {
    deps = await getRelaunchOTPModuleE2E();
  });

  afterAll(async () => {
    await deps.app.close();
  })

  it('should be able to relaunch OTP', async () => {
    const expectedResponse = z.object({
      cancelKey: z.string(),
    });
    const res = await createRelaunchOTPE2E({
      shouldCreateContent: {},
      ...deps
    });
    expect(res.status).toBe(200);
    expect(expectedResponse.parse(res.body)).toBeTruthy();
  });

  it('throw one error: OTP not launched', async () => {
    const res = await createRelaunchOTPE2E({ ...deps });
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  });

  it('throw one error: wrong time - to early', async () => {
    const res = await createRelaunchOTPE2E({
      shouldCreateContent: {
        time: new Date(),
      },
      ...deps
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
      ...deps
    });
    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  });
});
