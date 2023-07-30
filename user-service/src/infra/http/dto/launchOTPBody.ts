import { IsEmail, Length } from 'class-validator';

export class LaunchOTPBody {
  @Length(6, 256)
  @IsEmail()
  email: string;
}
