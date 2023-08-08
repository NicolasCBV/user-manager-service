import { Email } from '@app/entities/user/email';
import { Name } from '@app/entities/user/name';
import { Password } from '@app/entities/user/password';
import { userFactory } from '@root/test/fatories/user';
import { userInCacheFactory } from '@root/test/fatories/userInCache';
import * as request from 'supertest';
import { ICreateUserModReturn } from './getModule';

type TProps = {
  shouldCreateContentOnDB: boolean;
  shouldCreateContentOnCache: boolean;
} & ICreateUserModReturn;

export const createDefaultEnvOnCreateUserE2E = async ({
  shouldCreateContentOnDB,
  shouldCreateContentOnCache,
  userRepo,
  userHandler,
  app,
}: TProps) => {
  if (shouldCreateContentOnDB)
    await userRepo.create(
      userFactory({
        name: new Name('John Doe'),
        email: new Email('johndoe@email.com'),
        password: new Password('1234Df'),
      }),
    );

  if (shouldCreateContentOnCache)
    await userHandler.sendUser(
      userInCacheFactory({
        name: new Name('John Doe'),
        email: new Email('johndoe@email.com'),
        password: new Password('1234Df'),
      }),
      10000,
    );

  const res = await request(app.getHttpServer())
    .post('/users/create')
    .send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '1234Df',
    })
    .set('Content-Type', 'application/json');

  return res;
};
