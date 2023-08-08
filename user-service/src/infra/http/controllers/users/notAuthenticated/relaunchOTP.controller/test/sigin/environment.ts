import * as request from 'supertest';
import { Password } from '@app/entities/user/password';
import { userInCacheFactory } from '@root/test/fatories/userInCache';
import { OTPFactory } from '@root/test/fatories/OTP';
import { generateRandomCharacters } from '@infra/helpers/generateRandomCharacters';
import { IRelaunchOTPModReturn } from '../../../relaunchOTP.controller/test/getModule';

type TProps = {
  shouldCreateContent?: {
    time?: Date;
  };
} & IRelaunchOTPModReturn;

export const createRelaunchOTPE2E = async ({
  shouldCreateContent,
  app,
  miscHandler,
  ...dependencies
}: TProps) => {
  const password = '1234Df';
  const user = userInCacheFactory({
    password: new Password(await dependencies.crypt.hash(password)),
  });

  const code = generateRandomCharacters();
  const otp = OTPFactory({
    userIdentificator: user.id,
    code: await dependencies.crypt.hash(code),
    createdAt:
      shouldCreateContent?.time ??
      new Date(Date.now() - parseInt(process.env.OTP_TIME ?? '120000') + 10000),
  });
  const cancelKey = OTPFactory({
    userIdentificator: user.id,
    createdAt:
      shouldCreateContent?.time ??
      new Date(Date.now() - parseInt(process.env.OTP_TIME ?? '120000') + 10000),
  });

  if (shouldCreateContent)
    await miscHandler.startUserSigin(user, otp, cancelKey);

  const res = await request(app.getHttpServer())
    .post('/users/launch-otp')
    .set('Content-Type', 'application/json')
    .send({
      email: user.email.value,
    });

  return res;
};
