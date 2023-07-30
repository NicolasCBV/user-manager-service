import { BcryptAdapter } from '@src/app/adapters/bcrypt/bcryptAdapter';
import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { userFactory } from '@root/test/fatories/user';
import { UserInCache } from '@app/entities/userInCache/userInCache';
import { JwtService } from '@nestjs/jwt';
import { NodemailerAdapter } from '@app/adapters/nodemailer/nodemailerAdapter';
import { TokenHandler } from '@infra/storages/cache/redis/handlers/token/tokenHandler';
import { getForgotPasswordModule } from './getModule';

jest.mock('@infra/storages/search/searchUserManager.service');
jest.mock('@app/adapters/nodemailer/nodemailerAdapter');
jest.mock('@app/adapters/bcrypt/bcryptAdapter');
jest.mock('@nestjs/jwt');

describe('Finish forgot password process test', () => {
  afterEach(async () => {
    jest.resetAllMocks();

    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be able to start the forgot password process', async () => {
    const user = userFactory();
    const cryptMock = jest
      .spyOn(BcryptAdapter.prototype, 'hash')
      .mockImplementation(async () => 'hashed');
    const jwtMock = jest
      .spyOn(JwtService.prototype, 'sign')
      .mockImplementation(() => 'signedToken');
    const emailMock = jest
      .spyOn(NodemailerAdapter.prototype, 'send')
      .mockImplementation();
    const searchUserMock = jest
      .spyOn(SearchUserManager.prototype, 'exec')
      .mockImplementation(async () => new UserInCache(user));
    const tokenHandler = jest
      .spyOn(TokenHandler.prototype, 'sendToken')
      .mockImplementation();
    const { forgotPassword } = await getForgotPasswordModule();

    await forgotPassword.exec({
      email: user.email.value,
      deviceId: 'default id',
    });

    expect(cryptMock).toHaveBeenCalled();
    expect(emailMock).toHaveBeenCalled();
    expect(jwtMock).toHaveBeenCalled();
    expect(searchUserMock).toHaveBeenCalled();
    expect(tokenHandler).toHaveBeenCalled();
  });
});
