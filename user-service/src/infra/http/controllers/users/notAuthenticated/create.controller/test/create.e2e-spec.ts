import { z } from 'zod';
import { createDefaultEnvOnCreateUserE2E } from './environment';
import { getCreateUserModuleE2E, ICreateUserModReturn } from './getModule';

describe('Create user e2e test', () => {
  const expectedResponse = z.object({
    cancelKey: z.string().uuid(),
  });

  let deps: ICreateUserModReturn;

  beforeAll(async () => {
    deps = await getCreateUserModuleE2E();
  });

  afterAll(async () => {
    await deps.app.close();
  })

  it('should create one user', async () => {
    const res = await createDefaultEnvOnCreateUserE2E({
      shouldCreateContentOnDB: false,
      shouldCreateContentOnCache: false,
      ...deps
    });

    expect(res.status).toBe(200);
    expect(expectedResponse.parse(res.body)).toBeTruthy();
  });

  it('should throw one error: user already exist on database', async () => {
    const expectedResponseErr = z.object({
      statusCode: z.number(),
      message: z.string(),
    });

    const res = await createDefaultEnvOnCreateUserE2E({
      shouldCreateContentOnDB: true,
      shouldCreateContentOnCache: false,
      ...deps
    });

    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  });

  it('should throw one error: user already exist on cache', async () => {
    const expectedResponseErr = z.object({
      statusCode: z.number(),
      message: z.string(),
    });
    const res = await createDefaultEnvOnCreateUserE2E({
      shouldCreateContentOnDB: false,
      shouldCreateContentOnCache: true,
      ...deps
    });

    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
    expect(res?.body?.message).toEqual('Unauthorized');
  });
});
