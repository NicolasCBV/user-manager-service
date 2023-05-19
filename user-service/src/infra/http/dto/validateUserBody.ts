import { IsEmail, Length } from 'class-validator';

export class ValidateUserBody {
  @Length(7, 7)
  OTP: string;

  @IsEmail()
  @Length(6, 256)
  email: string;

  deviceId?: string;
}
