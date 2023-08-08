import * as request from 'supertest';
import { IRefreshTokenModReturn } from './getModule';
import { userFactory } from '@test/fatories/user';
import * as cookie from 'cookie-signature';

type TProps = {
  shouldCreateContent?:
    | {
        onlyTokens?: boolean;
        deviceIdOutput?: string;
        deviceIdInput?: string;
      }
    | boolean;
} & IRefreshTokenModReturn;

export const createDefaultEnvOnRefreshTokenE2E = async ({
  shouldCreateContent,
  app,
  genToken,
  tokenHandler,
  crypt,
  userRepo,
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
      await userRepo.create(user);

    await tokenHandler.throwMainAuthTokens(
      user.id,
      access_token,
      refresh_token,
    );

    token = refresh_token;
  }

  const authCookie = token
    ? 's:' + cookie.sign(token, process.env.COOKIE_SECRET as string)
    : '';

  const res = await request(app.getHttpServer())
    .post('/users/refresh-token')
    .set('Content-Type', 'application/json')
    .set('cookie', `refresh-cookie=${encodeURIComponent(authCookie)}`)
    .send({
      deviceId: deviceIdOnBody ?? '',
    });

  return { res };
};
