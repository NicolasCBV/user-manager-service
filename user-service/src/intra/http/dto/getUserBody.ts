import { IsEmail, Length } from "class-validator";

export class GetUserBody {
  @Length(6, 256)
  @IsEmail()
  email: string;
}
