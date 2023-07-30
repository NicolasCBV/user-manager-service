import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserObject } from '@app/mappers/userInObjects';

interface IGenToken {
  userId: string;
  email: string;
  deviceId: string | null;
  userData?: Omit<UserObject, 'id' | 'password' | 'email'>;
}

@Injectable()
export class GenTokensService {
  constructor(private readonly jwtService: JwtService) {}

  exec({ email, deviceId, userData, userId }: IGenToken) {
    const default_key = process.env.TOKEN_SECRET as string;
    const refresh_key = process.env.REFRESH_TOKEN_KEY as string;

    const raw_default_expires = parseInt(process.env.TOKEN_EXPIRES ?? '900000');
    const raw_refresh_expires = parseInt(
      process.env.REFRESH_TOKEN_EXPIRES ?? '86400000',
    );

    const default_expires = Math.floor(raw_default_expires / 1000);
    const refresh_expires = Math.floor(raw_refresh_expires / 1000);

    const access_token = this.jwtService.sign(
      {
        sub: userId,
        email,
        type: 'access_token',
        deviceId,
        userData,
      },
      {
        secret: default_key,
        expiresIn: default_expires,
      },
    );

    const refresh_token = this.jwtService.sign(
      {
        sub: userId,
        email,
        type: 'refresh_token',
        deviceId: deviceId,
      },
      {
        secret: refresh_key,
        expiresIn: refresh_expires,
      },
    );

    return { access_token, refresh_token };
  }
}
