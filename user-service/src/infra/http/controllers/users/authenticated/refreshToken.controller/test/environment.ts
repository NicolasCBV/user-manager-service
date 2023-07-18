import * as request from 'supertest';
import { getRefreshTokenModuleE2E } from "./getModule";
import { userFactory } from '@test/fatories/user';
import * as cookie from 'cookie-signature';

interface IProps {
  shouldCreateContent?: {
    onlyTokens?: boolean;
    deviceIdOutput?: string;
    deviceIdInput?: string;
  } | boolean;
}

export const createDefaultEnvOnRefreshTokenE2E = async ({
  shouldCreateContent, 
}: IProps) => {
    const user = userFactory();
    const {
      app,
      genToken,
      tokenHandler,
      crypt,
      userRepo
    } = await getRefreshTokenModuleE2E();

    let deviceIdOnDB: string | undefined;
    let deviceIdOnBody: string | undefined;
    let token: string = "";
    
    if(shouldCreateContent) {
      deviceIdOnDB = typeof shouldCreateContent === 'object'
        ? shouldCreateContent.deviceIdOutput
        : '';
      deviceIdOnBody = typeof shouldCreateContent === 'object'
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

      if(
        typeof shouldCreateContent === 'boolean' ||
        (typeof shouldCreateContent === 'object' 
        && !shouldCreateContent.onlyTokens)
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
      ? cookie.sign(token, process.env.REFRESH_TOKEN_KEY as string)
      : '';
    const res = await request(app.getHttpServer())
      .post('/users/refresh-token')
      .set('Content-Type', 'application/json')
      .set('cookie', `refresh-cookie=${authCookie}`)
      .send({
        deviceId: deviceIdOnBody ?? '' 
      });

    return { res };
}
