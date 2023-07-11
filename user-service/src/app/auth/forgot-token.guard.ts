import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenHandlerContract } from '@root/src/infra/storages/cache/contract/tokenHandler';

@Injectable()
export class ForgotTokenGuard implements CanActivate {
  constructor (
    private readonly tokenHandler: TokenHandlerContract,
    private readonly jwtService: JwtService
  ) {}

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const rawSub = req?.headers?.authorization;

    const sub = rawSub?.split(' ')[1];
    if(!sub) throw new UnauthorizedException();

    const token = await this.tokenHandler.getToken(sub, 'forgot_token');
    if(!token) throw new UnauthorizedException();

    const result = await this.jwtService.verify(token, {
      secret: process.env.FORGOT_TOKEN_KEY
    })
    if(!result) throw new UnauthorizedException();

    req.user = this.jwtService.decode(token);

    return true;
  }
}
