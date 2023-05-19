import { IsEmail, Length } from 'class-validator';

export class LaunchOTPBody {
  @Length(6, 64)
  @IsEmail()
  email: string;
}
