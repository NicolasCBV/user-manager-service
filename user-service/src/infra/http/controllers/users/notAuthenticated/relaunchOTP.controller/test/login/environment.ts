import * as request from 'supertest';
import { Password } from '@app/entities/user/password';
import { userInCacheFactory } from '@root/test/fatories/userInCache';
import { OTPFactory } from '@root/test/fatories/OTP';
import { generateRandomCharacters } from '@infra/helpers/generateRandomCharacters';
import { IRelaunchOTPModReturn } from '../../../relaunchOTP.controller/test/getModule';
import { UserInCache } from '@root/src/app/entities/userInCache/userInCache';

type TProps = {
  shouldCreateContent?: {
    time?: Date;
  };
} & IRelaunchOTPModReturn;

export const createRelaunchOTPE2E = async ({
  shouldCreateContent,
  app,
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

  if (shouldCreateContent) {
    await dependencies.userRepo.create(user);
    await dependencies.userHandler.sendUser(
      new UserInCache(user),
      1000 * 60 * 60 * 24,
    );
    await dependencies.otpHandler.sendOTP(otp, user.email.value, true);
  }

  const res = await request(app.getHttpServer())
    .post('/users/launch-otp-login')
    .set('Content-Type', 'application/json')
    .send({
      email: user.email.value,
    });

  return res;
};
