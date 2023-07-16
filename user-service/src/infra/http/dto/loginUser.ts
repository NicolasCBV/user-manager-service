import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class LoginUserBody {
  @Length(6, 64)
  @IsEmail()
  email: string;

  @IsString()
  @Length(7)
  code: string;

  @IsString()
  @IsOptional()
  deviceId?: string;
}
