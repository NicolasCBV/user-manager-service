import * as request from 'supertest';
import { IUpdateContentModReturn } from './getModule';
import { userFactory } from '@root/test/fatories/user';

type TProps = {
  shouldCreateContent?:
    | {
        deviceIdOutput: string;
        deviceIdInput: string;
      }
    | boolean;
} & IUpdateContentModReturn;

export const createDefaultEnvOnUpdateContentE2E = async ({
  shouldCreateContent,
  app,
  genToken,
  tokenHandler,
  ...dependencies
}: TProps) => {
  const user = userFactory();

  let deviceIdOnDB: string | undefined;
  let deviceIdOnBody: string | undefined;
  let token = '';

  if (shouldCreateContent) {
    deviceIdOnDB =
      typeof shouldCreateContent === 'object'
        ? shouldCreateContent.deviceIdOutput
        : '';
    deviceIdOnBody =
      typeof shouldCreateContent === 'object'
        ? shouldCreateContent.deviceIdInput
        : '';

    const { refresh_token, access_token } = genToken.exec({
      userId: user.id,
      deviceId: deviceIdOnDB
        ? await dependencies.crypt.hash(deviceIdOnDB)
        : null,
      email: user.email.value,
      userData: {
        name: user.name.value,
        description: user?.description?.value,
        imageUrl: user.imageUrl,
        level: user.level,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    await dependencies.userRepo.create(user);
    await tokenHandler.throwMainAuthTokens(
      user.id,
      access_token,
      refresh_token,
    );

    token = access_token;
  }

  const res = await request(app.getHttpServer())
    .patch('/users/update')
    .set('authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({
      name: 'John Doe',
      description: 'New description',
      deviceId: deviceIdOnBody ?? '',
    });

  return { res, dependencies, user };
};
