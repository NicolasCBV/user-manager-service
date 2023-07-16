import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { IDefaultPropsJwt } from '../../jwt.core';

@Injectable()
export class ForgotTokenGuard implements CanActivate {
  constructor(
    private readonly tokenHandler: TokenHandlerContract,
    private readonly jwtService: JwtService,
  ) {}

  private async checkToken(token: string) {
    const tokenData: IDefaultPropsJwt = await this.jwtService
      .verifyAsync(token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      })
      .catch(() => {
        throw new UnauthorizedException();
      });

    return tokenData;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const rawSub = req?.headers?.authorization;

    const sub = rawSub?.split(' ')[1];
    if (!sub) throw new UnauthorizedException();

    const token = await this.tokenHandler.getToken(sub, 'forgot_token');
    if (!token) throw new UnauthorizedException();

    const tokenData = await this.checkToken(token);

    req.user = tokenData;

    return true;
  }
}
