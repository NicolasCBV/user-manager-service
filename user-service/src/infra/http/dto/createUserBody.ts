import {
  Length,
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class CreateUserBody {
  @IsString()
  @Length(2, 64)
  name: string;

  @Length(6, 256)
  @IsEmail()
  email: string;

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
