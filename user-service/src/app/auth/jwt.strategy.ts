import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { IJwtTokenUser, validateToken } from './jwt.core';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-main') {
  constructor(private readonly tokenHandler: TokenHandlerContract) {
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.TOKEN_SECRET as string,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IJwtTokenUser) {
    const res = await validateToken({
      tokenHandler: this.tokenHandler,
      payload,
      req,
    });

    return res;
  }
}
