import { UnauthorizedException } from '@nestjs/common';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { Request } from 'express';
import { UserObject } from '../mappers/userInObjects';

export interface IDefaultPropsJwt {
  type: 'refresh_token' | 'access_token' | 'forgot_token';
  sub: string;
  email: string;
  deviceId?: string;
  iat: number;
  exp: number;
}

export type IJwtTokenUser =
  | ({
      userData: Omit<UserObject, 'id' | 'password'>;
    } & IDefaultPropsJwt)
  | IDefaultPropsJwt;

interface IProps {
  tokenHandler: TokenHandlerContract;
  req: Request;
  payload: IJwtTokenUser;
}

export async function validateToken({ tokenHandler, req, payload }: IProps) {
  const token = await tokenHandler.getToken(payload.sub, payload.type);
  const tokenInReq = req.headers.authorization?.split(' ')[1];

  if (!payload || !token || token !== tokenInReq) {
    throw new UnauthorizedException();
  }

  return payload;
}
