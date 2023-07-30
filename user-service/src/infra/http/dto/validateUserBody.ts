import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class ValidateUserBody {
  @IsString()
  @Length(7, 7)
  OTP: string;

  @IsEmail()
  @Length(6, 256)
  email: string;

  @IsString()
  @IsOptional()
  deviceId?: string;
}
