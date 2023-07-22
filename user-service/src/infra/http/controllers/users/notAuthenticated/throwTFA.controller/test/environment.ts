import { userFactory } from '@root/test/fatories/user';
import * as request from 'supertest';
import { Password } from '@app/entities/user/password';
import { getThrowTFAModuleE2E } from './getModule';

interface IProps {
  shouldCreateContent: boolean;
  passwordInput?: string;
}

export const createDefaultEnvOnThrowTFAE2E = async ({
  shouldCreateContent,
  passwordInput,
}: IProps) => {
  const { app, userRepo, ...dependencies } = await getThrowTFAModuleE2E();

  const password = '1234Df';
  const user = userFactory({
    password: new Password(await dependencies.crypt.hash(password)),
  });

  if (shouldCreateContent) await userRepo.create(user);

  const res = await request(app.getHttpServer())
    .post('/users/throwTFA')
    .set('Content-Type', 'application/json')
    .send({
      email: user.email.value,
      password: passwordInput ?? password,
    });

  return res;
};
