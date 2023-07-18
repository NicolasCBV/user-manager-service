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

  private async compareDeviceId(
    deviceId?: string,
    hashedDeviceId?: string | null,
  ) {
    return hashedDeviceId
      ? await this.crypt.compare(String(deviceId), hashedDeviceId)
      : !deviceId;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user: IDefaultPropsJwt | undefined = req?.user;
    if (!user) throw new UnauthorizedException();

    const regex = /deviceId=([^&]+)/gm;
    const searchOnQuery = regex.exec(req?._parsedUrl?.query ?? '');
    const searchOnBody: string | undefined = req?.body?.deviceId;

    const unhashedDeviceId: string | undefined = searchOnBody
      ? searchOnBody
      : searchOnQuery instanceof Array
      ? decodeURIComponent(searchOnQuery[1])
      : undefined;

    if (!(await this.compareDeviceId(unhashedDeviceId, user.deviceId)))
      throw new UnauthorizedException();

    return true;
  }
}
