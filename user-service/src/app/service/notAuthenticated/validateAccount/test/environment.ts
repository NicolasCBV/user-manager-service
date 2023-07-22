import { UserInCache } from '@root/src/app/entities/userInCache/userInCache';
import { OTPFactory } from '@root/test/fatories/OTP';
import { userFactory } from '@root/test/fatories/user';
import { getValidateAccountModule } from './getModule';

export const createDefaultSituationOnValidationServ = async () => {
  const { validateAccount, ...dependencies } = await getValidateAccountModule();

  const user = userFactory();
  const otp = OTPFactory();
  const cancelKey = OTPFactory();

  await dependencies.miscHandler.startUserSigin(
    new UserInCache(user),
    otp,
    cancelKey,
  );

  const exec = () =>
    validateAccount.exec({
      email: user.email.value,
      OTP: otp.code,
    });
  return { exec };
};
