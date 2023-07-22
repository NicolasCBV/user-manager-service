import { IsOptional, IsString } from 'class-validator';

export class RefreshTokenBody {
  @IsString()
  @IsOptional()
  deviceId?: string;
}
