import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieAdapter } from '@app/adapters/cookie';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { IDefaultPropsJwt } from '../../jwt.core';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly cookieAdapter: CookieAdapter,
    private readonly tokenHandler: TokenHandlerContract,
    private readonly jwtService: JwtService,
  ) {}

  private async checkCookie(cookie: string) {
    const token = await this.cookieAdapter.validateSignedCookie({
      cookie: decodeURIComponent(cookie),
      key: process.env.COOKIE_SECRET as string,
    });

    if (!token) throw new UnauthorizedException();
    return token;
  }

  private async checkToken(token: string) {
    const tokenData: IDefaultPropsJwt = await this.jwtService
      .verifyAsync(token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      })
      .catch(() => {
        throw new UnauthorizedException();
      });

    const existentToken = await this.tokenHandler.getToken(
      tokenData.sub,
      'refresh_token',
    );
    if (!existentToken || existentToken !== token)
      throw new UnauthorizedException();

    return tokenData;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.headers.cookie) throw new UnauthorizedException();

    const authCookie = req?.headers.cookie.split('refresh-cookie=')[1];
    if (!authCookie) throw new UnauthorizedException();

    const token = await this.checkCookie(authCookie);
    const tokenData = await this.checkToken(token);

    req.user = tokenData;
    return true;
  }
}
