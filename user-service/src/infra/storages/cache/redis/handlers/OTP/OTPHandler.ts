import { OTP } from '@src/app/entities/OTP/_OTP';
import { OTPMapper } from '@src/app/mappers/OTPMapper';
import { DefaultHandlerParams } from '..';
import { redisClient } from '../../redisClient';

export class OTPHandler extends DefaultHandlerParams implements OTPHandler {
  async sendOTP(otp: OTP, email: string): Promise<void> {
    const ttl = process.env.OTP_TIME as unknown as number;

    await redisClient.set(
      `${this.otpKW}:${email}`,
      JSON.stringify(otp),
      'PX',
      ttl,
      'NX',
    );
  }
  async getOTP(email: string): Promise<OTP | null> {
    const rawOTPString = await redisClient.get(`${this.otpKW}:${email}`);

    if (!rawOTPString) return null;

    const rawOTP = JSON.parse(rawOTPString);
    const otp = OTPMapper.fromJsonToClass(rawOTP);

    return otp;
  }

  async getCancelKeyOTP(email: string) {
    const rawOTPString = await redisClient.get(
      `${this.otpKW}:${email}.cancelKey`,
    );

    if (!rawOTPString) return null;

    const rawOTP = JSON.parse(rawOTPString);
    const otp = OTPMapper.fromJsonToClass(rawOTP);

    return otp;
  }
}
