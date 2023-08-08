import { z } from 'zod';
import { getModulesOfGetUserE2E, IGetUserModReturn } from './getModule';
import { userFactory } from '@root/test/fatories/user';
import * as request from 'supertest';

describe('Get user E2E', () => {
  let deps: IGetUserModReturn;

  beforeAll(async () => {
    deps = await getModulesOfGetUserE2E();
  });

  afterAll(async () => {
    await deps.app.close();
  });

  it('should be able to get user', async () => {
    const expectedReponse = z.object({
      user: z.object({
        id: z.string(),
        name: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        cachedAt: z.string(),
      }),
    });

    const user = userFactory();

    await deps.userRepo.create(user);

    const res = await request(deps.app.getHttpServer()).get(
      `/users/${encodeURIComponent(user.email.value)}`,
    );

    expect(res.status).toBe(200);
    expect(expectedReponse.parse(res.body)).toBeTruthy();
  });

  it('should be able to get null as a response', async () => {
    const expectedResponse = z.object({
      user: z.null(),
    });
    const res = await request(deps.app.getHttpServer()).get(
      `/users/${encodeURIComponent('fake@email.com')}`,
    );

    expect(res.status).toBe(200);
    expect(expectedResponse.parse(res.body)).toBeTruthy();
  });
});
