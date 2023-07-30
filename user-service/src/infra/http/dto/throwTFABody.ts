import { IsEmail, IsString, Length } from 'class-validator';

export class ThrowTFABody {
  @Length(6, 256)
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 256)
  password: string;
}
