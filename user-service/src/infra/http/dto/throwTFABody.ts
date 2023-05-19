import { IsEmail, Length } from 'class-validator';

export class ThrowTFABody {
  @Length(6, 64)
  @IsEmail()
  email: string;

  @Length(6, 256)
  password: string;
}
