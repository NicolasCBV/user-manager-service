import { IsString, Length } from 'class-validator';

export class FinishForgotPasswordBody {
  @IsString()
  @Length(6, 256)
  password: string;
}
