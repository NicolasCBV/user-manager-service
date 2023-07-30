import * as request from 'supertest';
import { IDeleteUserModReturn } from './getModule';
import { userFactory } from '@root/test/fatories/user';

type TProps = {
  shouldCreateContent?:
    | {
        onlyTokens?: boolean;
        deviceIdOutput?: string;
        deviceIdInput?: string;
      }
    | boolean;
} & IDeleteUserModReturn;

export const createDefaultEnvOnDeleteUserE2E = async ({
  shouldCreateContent,
  app,
  genToken,
  tokenHandler,
  crypt,
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
      deviceId: deviceIdOnDB ? await crypt.hash(deviceIdOnDB) : null,
      email: user.email.value,
      userData: {
        name: user.name.value,
        description: user?.description?.value,
        imageUrl: user.imageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    if (
      typeof shouldCreateContent === 'boolean' ||
      (typeof shouldCreateContent === 'object' &&
        !shouldCreateContent.onlyTokens)
    )
      await dependencies.userRepo.create(user);

    await tokenHandler.throwMainAuthTokens(
      user.id,
      access_token,
      refresh_token,
    );

    token = access_token;
  }

  const res = await request(app.getHttpServer())
    .delete('/users/delete')
    .set('authorization', `Bearer ${token}`)
    .send({
      deviceId: deviceIdOnBody ?? '',
    });

  return { res, dependencies, user };
};
