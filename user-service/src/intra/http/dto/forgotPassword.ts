import { IsEmail, Length } from 'class-validator';

export class ForgotPasswordBody {
  @Length(6, 64)
  @IsEmail()
  email: string;

  deviceId?: string;
}
