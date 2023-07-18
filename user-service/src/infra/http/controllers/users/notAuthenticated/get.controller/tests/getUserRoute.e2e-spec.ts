import { redisClient } from "@infra/storages/cache/redis/redisClient";
import { z } from 'zod';
import { getModulesOfGetUserE2E } from "./getModule";
import { userFactory } from "@root/test/fatories/user";
import * as request from 'supertest';

describe('Get user E2E', () => {
  afterEach(async () => {
    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be able to get user', async () => {
    const expectedReponse = z.object({
      user: z.object({
        id: z.string(),
        name: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        cachedAt: z.string()
      })
    });

    const {
      app,
      userRepo
    } = await getModulesOfGetUserE2E();
    const user = userFactory();

    await userRepo.create(user);

    const res = await request(app.getHttpServer())
      .get(`/users/${encodeURIComponent(user.email.value)}`);

    expect(res.status).toBe(200);
    expect(expectedReponse.parse(res.body)).toBeTruthy();
  });

  it('should be able to get null as a response', async () => {
    const expectedResponse = z.object({
      user: z.null()
    });
    const { app } = await getModulesOfGetUserE2E();
    const res = await request(app.getHttpServer())
      .get(`/users/${encodeURIComponent('fake@email.com')}`);

    expect(res.status).toBe(200);
    expect(expectedResponse.parse(res.body)).toBeTruthy();
  });
});

