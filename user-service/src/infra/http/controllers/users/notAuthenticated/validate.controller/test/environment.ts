import * as request from 'supertest';
import { Password } from '@app/entities/user/password';
import { IValidateAccountModReturn } from './getModule';
import { userInCacheFactory } from '@root/test/fatories/userInCache';
import { OTPFactory } from '@root/test/fatories/OTP';
import { generateRandomCharacters } from '@infra/helpers/generateRandomCharacters';

type TProps = {
  shouldCreateContent: boolean;
  codeInput?: string;
  deviceIdInput?: string;
} & IValidateAccountModReturn;

export const createDefaultEnvOnValidateUserE2E = async ({
  shouldCreateContent,
  codeInput,
  deviceIdInput,
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
  });
  const cancelKey = OTPFactory({
    userIdentificator: user.id,
  });

  if (shouldCreateContent)
    await dependencies.miscHandler.startUserSigin(user, otp, cancelKey);

  const res = await request(app.getHttpServer())
    .post('/users/validate')
    .set('Content-Type', 'application/json')
    .send({
      OTP: codeInput ?? code,
      email: user.email.value,
      deviceId: deviceIdInput ?? '',
    });

  return res;
};
