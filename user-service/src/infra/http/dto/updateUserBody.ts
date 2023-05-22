import { Length } from 'class-validator';

export class UpdateUserBody {
  @Length(2, 64)
  name: string;

  description?: string;

  deviceId?: string;
}
