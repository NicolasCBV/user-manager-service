import { Injectable } from '@nestjs/common';
import { CryptAdapter } from '../../adapters/crypt';
import { DefaultService } from '../defaultService';

export interface ICheckFingerprintServiceErrors {
  notMatch: Error;
}

@Injectable()
export class CheckFingerprintService extends DefaultService<ICheckFingerprintServiceErrors> {
  constructor(private readonly crypt: CryptAdapter) {
    super({
      previsibleErrors: {
        notMatch: new Error("The device id doesn't match"),
      },
    });
  }

  async exec(deviceId?: string, deviceIdOnToken?: string) {
    if (!deviceIdOnToken) return;

    const result = deviceId
      ? await this.crypt.compare(deviceId, deviceIdOnToken)
      : false;

    if (!result) throw this.previsibileErrors.notMatch;
  }
}
