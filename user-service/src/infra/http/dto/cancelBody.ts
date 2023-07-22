import { Length, IsEmail, IsUUID, IsString } from 'class-validator';

export class CancelBody {
  @Length(6, 256)
  @IsEmail()
  email: string;

  @IsString()
  @IsUUID()
  cancelKey: string;
}
