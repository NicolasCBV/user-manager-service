import {
  Length,
  IsEmail,
  IsString,
} from 'class-validator';

export class CreateUserBody {
  @IsString()
  @Length(2, 64)
  name: string;

  @Length(6, 256)
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 256)
  password: string;
}
