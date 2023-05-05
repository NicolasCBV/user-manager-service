import { UnauthorizedException } from '@nestjs/common';
import { TokenHandlerContract } from '@src/intra/storages/cache/contract/tokenHandler';
import { Request } from 'express';
import { UserObject } from '../mappers/userInObjects';
import { CheckFingerprintService } from '../service/notAuthenticated/checkFingerprint.service';

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
  checkFingerprintService: CheckFingerprintService;
  req: Request;
  payload: IJwtTokenUser;
}

export async function validateToken({
  tokenHandler,
  checkFingerprintService,
  req,
  payload
}: IProps) {
    const deviceId = req.body?.deviceId ?? req.query?.deviceId;
    if (typeof deviceId !== 'string' && deviceId !== undefined)
      throw new UnauthorizedException();

    const token = await tokenHandler.getToken(payload.sub, payload.type);
    const tokenInReq = req.headers.authorization?.split(' ')[1];

    if (
      !payload || 
      !token ||
      token !== tokenInReq
    ) {
      throw new UnauthorizedException();
    }

    await checkFingerprintService
      .exec(deviceId, payload.deviceId)
      .catch(() => {
        throw new UnauthorizedException();
      });

    return payload;
  }
