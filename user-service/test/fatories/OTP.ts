import { IPropsOTP, OTP } from '@src/app/entities/OTP/_OTP';
import { generateRandomCharacters } from '@infra/helpers/generateRandomCharacters';

type Override = Partial<IPropsOTP>;

export function OTPFactory(data?: Override) {
  return new OTP({
    code: generateRandomCharacters(),
    userIdentificator: 'userIdentificator',
    checked: false,
    createdAt: new Date(),
    ...data,
  });
}
