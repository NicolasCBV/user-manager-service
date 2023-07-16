import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CryptAdapter } from '@app/adapters/crypt';
import { IDefaultPropsJwt } from '../../jwt.core';

@Injectable()
export class FingerprintGuard implements CanActivate {
  constructor(private readonly crypt: CryptAdapter) {}

  private async compareDeviceId(deviceId?: string, hashedDeviceId?: string) {
    return hashedDeviceId
      ? !(await this.crypt.compare(String(deviceId), hashedDeviceId))
      : hashedDeviceId !== deviceId;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user: IDefaultPropsJwt | undefined = req?.user;
    if (!user) throw new UnauthorizedException();

    const unhashedDeviceId: string | undefined =
      req?.body?.deviceId ?? req?.params?.deviceId;
    if (await this.compareDeviceId(unhashedDeviceId, user.deviceId))
      throw new UnauthorizedException();

    return true;
  }
}
