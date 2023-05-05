import { IsEmail, Length } from 'class-validator';

export class LoginUserBody {
  @Length(6, 64)
  @IsEmail()
  email: string;

  @Length(7)
  code: string;

  deviceId?: string;
}
