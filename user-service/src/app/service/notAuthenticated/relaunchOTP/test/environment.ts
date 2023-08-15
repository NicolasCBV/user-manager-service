import { UserInCache } from '@root/src/app/entities/userInCache/userInCache';
import { OTPFactory } from '@root/test/fatories/OTP';
import { userFactory } from '@root/test/fatories/user';
import { getRelaunchOTPModule } from './getModule';

interface IProps {
  time: number;
  isLoging?: boolean;
}

export async function createDefaultSituationOnRelaunch({
  time,
  isLoging = false,
}: IProps) {
  const { relaunchOTP, ...dependencies } = await getRelaunchOTPModule();

  const user = userFactory();
  const otp = OTPFactory({
    createdAt: new Date(time),
  });
  const cancelKey = OTPFactory({
    createdAt: new Date(time),
  });

  if(!isLoging)
    await dependencies.userHandler.sendOTPForUser(
      new UserInCache(user),
      10000,
      otp,
      cancelKey,
    );

  if (isLoging) {
    await dependencies.userRepo.create(user);
    await dependencies.userHandler.sendUser(new UserInCache(user), 1000 * 60 * 60 * 24)
    await dependencies.otpHandler.sendOTP(otp, user.email.value, true);
  }

  const exec = () => relaunchOTP.exec({ email: user.email.value, isLoging });
  return { exec };
}
