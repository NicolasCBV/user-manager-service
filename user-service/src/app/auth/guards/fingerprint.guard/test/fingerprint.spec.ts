import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { BcryptAdapter } from '@app/adapters/bcrypt/bcryptAdapter';
import { tokenFactory } from '@root/test/fatories/jwtToken';
import { IDefaultPropsJwt } from '../../../jwt.core';
import { createDefaultSituationOnFingerprintGuard } from './environment';

jest.mock('@app/adapters/bcrypt/bcryptAdapter');

describe('Fingerprint guard test', () => {
  let tokenData: IDefaultPropsJwt | undefined;

  beforeEach(() => {
    BcryptAdapter.prototype.compare = jest.fn(async () => true);
    tokenData = tokenFactory();
  });

  afterEach(async () => {
    tokenData = tokenFactory();

    jest.resetAllMocks();
    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should resolve fingerprint guard', async () => {
    const { exec } = await createDefaultSituationOnFingerprintGuard(tokenData);
    expect(await exec()).toBeTruthy();
  });

  it('should throw one error: wrong device id using crypt adapter', async () => {
    BcryptAdapter.prototype.compare = jest.fn(async () => false);

    const { exec } = await createDefaultSituationOnFingerprintGuard(
      tokenData,
      'wrong device id',
    );
    expect(exec).rejects.toThrow();
  });

  it('should throw one error: wrong device id without using crypt adapter', async () => {
    tokenData = tokenFactory({ deviceId: undefined });
    const { exec } = await createDefaultSituationOnFingerprintGuard(
      tokenData,
      'wrong device id',
    );
    expect(exec).rejects.toThrow();
  });

  it('should throw one error: user does not exist', async () => {
    tokenData = undefined;
    const { exec } = await createDefaultSituationOnFingerprintGuard(tokenData);
    expect(exec).rejects.toThrow();
  });
});
