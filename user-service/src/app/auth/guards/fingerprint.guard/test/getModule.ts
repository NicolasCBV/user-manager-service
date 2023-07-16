import { Test } from '@nestjs/testing';
import { AdaptersModule } from '@root/src/app/adapters/adapters.module';
import { CryptAdapter } from '@root/src/app/adapters/crypt';
import { FingerprintGuard } from '..';

export const getFingerprintModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AdaptersModule],
    providers: [FingerprintGuard],
  }).compile();

  return {
    crypt: moduleRef.get(CryptAdapter),
    fingerprintGuard: moduleRef.get(FingerprintGuard),
  };
};
