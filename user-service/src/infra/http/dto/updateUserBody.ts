import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserBody {
  @IsString()
  @Length(2, 64)
  name: string;

  @IsString()
  @Length(2, 256)
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  deviceId?: string;
}
