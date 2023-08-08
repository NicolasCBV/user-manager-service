import { createDefaultEnvOnCancelCreationE2E } from './environment';
import { z } from 'zod';
import {
  getCancelCreationModuleE2E,
  ICancelCreationUserModReturn,
} from './getModules';

describe('Cancel user creation E2E', () => {
  const expectedResponseErr = z.object({
    statusCode: z.number(),
    message: z.string(),
  });

  let deps: ICancelCreationUserModReturn;

  beforeAll(async () => {
    deps = await getCancelCreationModuleE2E();
  });

  afterAll(async () => {
    await deps.app.close();
  });

  it('should cancel user creation', async () => {
    const { res, user, userHandler } =
      await createDefaultEnvOnCancelCreationE2E({
        isCancelKeyWrong: false,
        shouldCreateContent: true,
        ...deps,
      });

    const nonexistentUser = await userHandler.find({ id: user.id });
    expect(res.status).toBe(200);
    expect(nonexistentUser).toBeNull();
  });

  it('should throw one error: user does not exist', async () => {
    const { res } = await createDefaultEnvOnCancelCreationE2E({
      shouldCreateContent: false,
      isCancelKeyWrong: false,
      ...deps,
    });

    expect(res.status).toBe(401);
    expect(expectedResponseErr.parse(res.body)).toBeTruthy();
  });
});
