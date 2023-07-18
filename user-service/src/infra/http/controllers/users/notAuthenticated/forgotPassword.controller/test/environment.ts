import { userFactory } from "@root/test/fatories/user";
import { getForgotPasswordModuleE2E } from "./getModule";
import * as request from 'supertest';

interface IProps {
  shouldCreateContent: boolean;
}

export const createDefaultEnvOnForgotPasswordE2E = async ({
  shouldCreateContent
}: IProps) => {
  const user = userFactory();
  const {
    app,
    ...dependencies
  } = await getForgotPasswordModuleE2E();

  if(shouldCreateContent)
    dependencies.userRepo.create(user);

  const res = await request(app.getHttpServer())
    .post('/users/forgot-password')
    .send({
      email: user.email.value
    })
    .set('Content-Type', 'application/json');

  return res;
}
