import * as request from 'supertest';
import { Password } from '@app/entities/user/password';
import { userInCacheFactory } from '@root/test/fatories/userInCache';
import { OTPFactory } from '@root/test/fatories/OTP';
import { generateRandomCharacters } from '@infra/helpers/generateRandomCharacters';
import { getRelaunchOTPModuleE2E } from '../../../relaunchOTP.controller/test/getModule';

interface IProps {
  shouldCreateContent?: {
    time?: Date;
  };
}

export const createRelaunchOTPE2E = async ({ shouldCreateContent }: IProps) => {
  const { app, miscHandler, ...dependencies } = await getRelaunchOTPModuleE2E();

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

  if (shouldCreateContent) {
    await dependencies.userRepo.create(user);
    await miscHandler.startUserSigin(user, otp, cancelKey);
  }

  const res = await request(app.getHttpServer())
    .post('/users/launch-otp-login')
    .set('Content-Type', 'application/json')
    .send({
      email: user.email.value,
    });

  return res;
};
