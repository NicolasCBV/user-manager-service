import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { BcryptAdapter } from '@app/adapters/bcrypt/bcryptAdapter';
import { MiscellaneousHandler } from '@infra/storages/cache/redis/handlers/misc/miscellaneousHandler';
import { GenTokensService } from '@app/service/notAuthenticated/genTokens.service';
import { createDefaultSituationOnValidationServ } from './environment';

jest.mock('@app/adapters/bcrypt/bcryptAdapter');
jest.mock('@nestjs/jwt');
jest.mock('@app/service/notAuthenticated/genTokens.service');

describe('Validate account test', () => {
  beforeEach(() => {
    BcryptAdapter.prototype.hash = jest.fn(async () => 'hashed');

    GenTokensService.prototype.exec = jest.fn(() => ({
      access_token: 'access_token',
      refresh_token: 'refresh_token',
    }));
  });

  afterEach(async () => {
    jest.resetAllMocks();

    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be able to validate user', async () => {
    BcryptAdapter.prototype.compare = jest.fn(async () => true);

    const { exec } = await createDefaultSituationOnValidationServ();

    const { refresh_token, access_token } = await exec();
    expect(typeof refresh_token).toEqual('string');
    expect(typeof access_token).toEqual('string');
  });

  it('should be able to throw an error: user was not storaged', async () => {
    BcryptAdapter.prototype.compare = jest.fn(async () => true);
    MiscellaneousHandler.prototype.startUserSigin = jest.fn();

    const { exec } = await createDefaultSituationOnValidationServ();

    expect(exec).rejects.toThrow();
  });

  it('should be able to throw an error: wrong OTP code', async () => {
    BcryptAdapter.prototype.compare = jest.fn(async () => false);

    const { exec } = await createDefaultSituationOnValidationServ();

    expect(exec).rejects.toThrow();
  });
});
