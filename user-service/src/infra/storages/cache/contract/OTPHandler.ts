import { OTP } from '@src/app/entities/OTP/_OTP';
import { DefaultHandlerParams } from '../redis/handlers';

export abstract class OTPHandlerContract extends DefaultHandlerParams {
  abstract sendOTP(otp: OTP, email: string, login?: boolean): Promise<void>;
  abstract getOTP(email: string, login?: boolean): Promise<OTP | null>;
  abstract getCancelKeyOTP(email: string): Promise<OTP | null>;
}
