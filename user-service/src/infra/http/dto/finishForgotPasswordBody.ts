import { IsString, IsStrongPassword, MaxLength } from 'class-validator';

export class FinishForgotPasswordBody {
  @IsString()
  @IsStrongPassword({
    minLength: 6,
    minNumbers: 1,
    minSymbols: 0,
    minLowercase: 1,
    minUppercase: 1,
  })
  @MaxLength(256)
  password: string;
}
