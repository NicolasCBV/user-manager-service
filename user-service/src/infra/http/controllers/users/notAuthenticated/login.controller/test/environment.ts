import { generateRandomCharacters } from '@infra/helpers/generateRandomCharacters';
import { OTPFactory } from '@root/test/fatories/OTP';
import { userFactory } from '@root/test/fatories/user';
import { IGetAuthModReturn } from './getModules';
import * as request from 'supertest';
import { Password } from '@app/entities/user/password';

type TProps = {
  shouldCreateContent?: {
    shouldUseDeviceId: boolean;
  };
  codeInput?: string;
} & IGetAuthModReturn;

export const createDefaultEnvOnLoginE2E = async ({
  shouldCreateContent,
  codeInput,
  app,
  userRepo,
  ...dependencies
}: TProps) => {
  const user = userFactory({
    password: new Password(await dependencies.crypt.hash('1234Df')),
  });
  const code = generateRandomCharacters();
  const otp = OTPFactory({
    userIdentificator: user.id,
    code: await dependencies.crypt.hash(code),
  });

  if (shouldCreateContent) {
    await userRepo.create(user);
    await dependencies.otpHandler.sendOTP(otp, user.email.value, true);
  }

  const res = await request(app.getHttpServer())
    .post('/users/login')
    .set('Content-Type', 'application/json')
    .send({
      email: user.email.value,
      code: codeInput ?? code ?? 'wrong code',
      deviceId: shouldCreateContent?.shouldUseDeviceId ? 'deviceId' : '',
    });

  return res;
};
