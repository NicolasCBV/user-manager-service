import { z } from 'zod';
import { createDefaultEnvOnUpdateContentE2E } from './environment';
import {
  getUpdateContentModuleE2E,
  IUpdateContentModReturn,
} from './getModule';

describe('Update user content E2E test', () => {
  const expectedResponseErr = z.object({
    statusCode: z.number(),
    message: z.string(),
  });

  let deps: IUpdateContentModReturn;

  beforeAll(async () => {
    deps = await getUpdateContentModuleE2E();
  });

  afterAll(async () => {
    await deps.app.close();
  });

  it('should be able to update user content', async () => {
    const { res, dependencies, user } =
      await createDefaultEnvOnUpdateContentE2E({
        shouldCreateContent: true,
        ...deps,
      });
    const userOnDB = await dependencies.userRepo.find({
      id: user.id,
    });

    expect(res.status).toBe(200);
    expect(userOnDB?.name.value).toEqual('John Doe');
    expect(userOnDB?.description?.value).toEqual('New description');
  });

  it('should be able to update user content with device id', async () => {
    const { res, dependencies, user } =
      await createDefaultEnvOnUpdateContentE2E({
        shouldCreateContent: {
          deviceIdOutput: 'device id',
          deviceIdInput: 'device id',
        },
        ...deps,
      });
    const userOnDB = await dependencies.userRepo.find({
      id: user.id,
    });

    expect(res.status).toBe(200);
    expect(userOnDB?.name.value).toEqual('John Doe');
    expect(userOnDB?.description?.value).toEqual('New description');
  });

  it('should throw one error: wrong device id', async () => {
    const { res } = await createDefaultEnvOnUpdateContentE2E({
      shouldCreateContent: {
        deviceIdOutput: 'device id',
        deviceIdInput: 'wrong device id',
      },
      ...deps,
    });

    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
  });

  it('should throw one error: user does not exist', async () => {
    const { res } = await createDefaultEnvOnUpdateContentE2E({
      shouldCreateContent: false,
      ...deps,
    });

    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
  });
});
