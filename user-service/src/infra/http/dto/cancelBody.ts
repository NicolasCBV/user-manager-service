import { Length, IsEmail, IsUUID } from 'class-validator';

export class CancelBody {
  @Length(6, 256)
  @IsEmail()
  email: string;

  @IsUUID()
  cancelKey: string;
}
