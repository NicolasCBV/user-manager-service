import { JwtService } from '@nestjs/jwt';
import { NodemailerAdapter } from '@src/app/adapters/nodemailer/nodemailerAdapter';
import { MiscellaneousHandler } from '@infra/storages/cache/redis/handlers/misc/miscellaneousHandler';
import { OTPHandler } from '@infra/storages/cache/redis/handlers/OTP/OTPHandler';
import { TokenHandler } from '@infra/storages/cache/redis/handlers/token/tokenHandler';
import { UserHandler } from '@infra/storages/cache/redis/handlers/user/userHandler';
import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { userFactory } from '@test/fatories/user';
import { InMemmoryUser } from '@test/inMemmoryDatabases/user';
import { BcryptAdapter } from '../../adapters/bcrypt/bcryptAdapter';
import { AuthService } from './auth.service';
import { GenTokensService } from './genTokens.service';

jest.mock('@src/app/adapters/nodemailer/nodemailerAdapter');
jest
  .spyOn(BcryptAdapter.prototype, 'compare')
  .mockImplementation(async () => true);

const bcryptAdapter = new BcryptAdapter();
const jwtService = new JwtService();
const genTokens = new GenTokensService(jwtService);
const tokenHandler = new TokenHandler();
const otpHandler = new OTPHandler();
const nodemailerAdapter = new NodemailerAdapter();
const miscHandler = new MiscellaneousHandler();

describe('Auth tests', () => {
  afterEach(async () => {
    jest.resetAllMocks();

    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should authenticate user', async () => {
    const userRepo = new InMemmoryUser();
    const userHandler = new UserHandler();
    const searchUserManager = new SearchUserManager(userHandler, userRepo);

    const user = userFactory();

    await userRepo.create(user);

    const authService = new AuthService(
      genTokens,
      bcryptAdapter,
      tokenHandler,
      searchUserManager,
      userHandler,
      otpHandler,
      miscHandler,
      nodemailerAdapter,
    );

    const validateResult = await authService.validateUser(
      user.email.value,
      user.password.value,
    );

    const { access_token, refresh_token } = await authService.login(
      user.email.value,
      'right code',
    );

    expect(validateResult).toEqual('OK');
    expect(typeof access_token).toEqual('string');
    expect(typeof refresh_token).toEqual('string');
  });

  it('should throw one error - wrong password', async () => {
    const userRepo = new InMemmoryUser();
    const userHandler = new UserHandler();
    const searchUserManager = new SearchUserManager(userHandler, userRepo);

    jest
      .spyOn(BcryptAdapter.prototype, 'compare')
      .mockImplementation(async () => false);

    const user = userFactory();

    await userRepo.create(user);

    const authService = new AuthService(
      genTokens,
      bcryptAdapter,
      tokenHandler,
      searchUserManager,
      userHandler,
      otpHandler,
      miscHandler,
      nodemailerAdapter,
    );

    await authService.validateUser(user.email.value, user.password.value);

    expect(authService.login(user.email.value, 'wrong code')).rejects.toThrow();
  });
});
