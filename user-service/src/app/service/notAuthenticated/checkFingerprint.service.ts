import { Injectable } from '@nestjs/common';
import { CryptAdapter } from '../../adapters/crypt';

@Injectable()
export class CheckFingerprintService {
  constructor(private readonly crypt: CryptAdapter) {}

  async exec(deviceId?: string, deviceIdOnToken?: string) {
    if (!deviceIdOnToken) return;

    const result = deviceId
      ? await this.crypt.compare(deviceId, deviceIdOnToken)
      : false;

    if (!result) throw new Error("The device id doesn't match");
  }
}
