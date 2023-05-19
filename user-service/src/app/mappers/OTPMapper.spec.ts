import { OTPFactory } from '@test/fatories/OTP';
import { OTPMapper } from './OTPMapper';

describe('OTP mapper tests', () => {
  it('should be able to convert json to class', () => {
    const OTP = OTPFactory();

    const rawOTPString = JSON.stringify(OTP);
    const rawOTP = JSON.parse(rawOTPString);

    const OTPConverted = OTPMapper.fromJsonToClass(rawOTP);

    expect(OTPConverted.code).toEqual(OTP.code);
    expect(OTPConverted.checked).toEqual(OTP.checked);
    expect(OTPConverted.createdAt).toEqual(OTP.createdAt);
    expect(OTPConverted.userIdentificator).toEqual(OTP.userIdentificator);
  });
});
