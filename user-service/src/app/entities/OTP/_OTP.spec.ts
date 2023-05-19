import { generateRandomCharacters } from '@infra/helpers/generateRandomCharacters';
import { randomUUID } from 'crypto';
import { OTP } from './_OTP';

describe('OTP test', () => {
  it('should create OTP', () => {
    const _OTP = new OTP({
      code: generateRandomCharacters(),
      userIdentificator: randomUUID(),
    });

    expect(_OTP).toBeInstanceOf(OTP);
  });
});
