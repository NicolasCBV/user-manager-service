import * as request from 'supertest';
import { IUploadImageModReturn } from './getModule';
import { userFactory } from '@root/test/fatories/user';
import * as path from 'path';

type TProps = {
  shouldCreateContent?:
    | {
        deviceIdOutput: string;
        deviceIdInput: string;
      }
    | boolean;
} & IUploadImageModReturn;

export const createDefaultEnvOnUpdateImageE2E = async ({
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

  const url = path.join(__dirname, 'test-unsplash.jpg');
  const res = await request(app.getHttpServer())
    .patch(
      `/users/upload-image${deviceIdOnBody && `?deviceId=${deviceIdOnBody}`}`,
    )
    .attach('file', url)
    .set('authorization', `Bearer ${token}`);

  return { res, dependencies, user };
};
