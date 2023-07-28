import { userFactory } from '@root/test/fatories/user';
import { IForgotPasswordModReturn } from './getModule';
import * as request from 'supertest';

type TProps = {
  shouldCreateContent: boolean;
} & IForgotPasswordModReturn;

export const createDefaultEnvOnForgotPasswordE2E = async ({
  shouldCreateContent,
  app,
  ...dependencies
}: TProps) => {
  const user = userFactory();

  if (shouldCreateContent) await dependencies.userRepo.create(user);

  const res = await request(app.getHttpServer())
    .post('/users/forgot-password')
    .send({
      email: user.email.value,
    })
    .set('Content-Type', 'application/json');

  return res;
};
