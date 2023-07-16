import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class ForgotPasswordBody {
  @Length(6, 64)
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  deviceId?: string;
}
