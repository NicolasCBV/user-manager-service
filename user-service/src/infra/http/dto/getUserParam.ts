import { IsString, Length } from 'class-validator';

export class GetUserParam {
  @Length(6, 256)
  @IsString()
  email: string;
}
