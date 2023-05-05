import { Length } from 'class-validator';

export class FinishForgotPassworBody {
  @Length(6, 256)
  password: string;
}
