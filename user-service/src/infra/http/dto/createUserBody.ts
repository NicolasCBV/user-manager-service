import { Length, IsEmail } from 'class-validator';

export class CreateUserBody {
  @Length(2, 64)
  name: string;

  @Length(6, 256)
  @IsEmail()
  email: string;

  @Length(6, 256)
  password: string;
}
