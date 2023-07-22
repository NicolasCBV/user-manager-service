import { OTPFactory } from '@test/fatories/OTP';
import { userInCacheFactory } from '@test/fatories/userInCache';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { getCancelCreationModuleE2E } from './getModules';

interface IProps {
  shouldCreateContent: boolean;
  isCancelKeyWrong: boolean;
}

export const createDefaultEnvOnCancelCreationE2E = async ({
  shouldCreateContent,
  isCancelKeyWrong,
}: IProps) => {
  const { app, userHandler, ...dependencies } =
    await getCancelCreationModuleE2E();

  const key = randomUUID();
  const user = userInCacheFactory();

  if (shouldCreateContent) {
    const otp = OTPFactory({
      userIdentificator: user.id,
    });
    const cancelKey = OTPFactory({
      userIdentificator: user.id,
      code: await dependencies.crypt.hash(key),
    });
    await dependencies.miscHandler.startUserSigin(user, otp, cancelKey);
  }

  const res = await request(app.getHttpServer())
    .delete('/users/cancel')
    .send({
      email: user.email.value,
      cancelKey: isCancelKeyWrong ? randomUUID() : key,
    })
    .set('Content-Type', 'application/json');

  return { res, userHandler, user };
};
