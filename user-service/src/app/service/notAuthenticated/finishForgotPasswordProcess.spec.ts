import { BcryptAdapter } from '@src/app/adapters/bcrypt/bcryptAdapter';
import { MiscellaneousHandler } from '@src/intra/storages/cache/redis/handlers/misc/miscellaneousHandler';
import { TokenHandler } from '@src/intra/storages/cache/redis/handlers/token/tokenHandler';
import { UserHandler } from '@src/intra/storages/cache/redis/handlers/user/userHandler';
import { redisClient } from '@src/intra/storages/cache/redis/redisClient';
import { SearchUserManager } from '@src/intra/storages/search/searchUserManager.service';
import { userFactory } from '@test/fatories/user';
import { InMemmoryUser } from '@test/inMemmoryDatabases/user';
import { FinishForgotPasswordService } from './finishForgotPasswordProcess.service';

jest
  .spyOn(BcryptAdapter.prototype, 'hash')
  .mockImplementation(async () => 'hashed');

const userRepo = new InMemmoryUser();
const userHandler = new UserHandler();
const searchForUser = new SearchUserManager(userHandler, userRepo);
const tokenHandler = new TokenHandler();
const miscHandler = new MiscellaneousHandler();
const bcryptHandler = new BcryptAdapter();

describe('Finish forgot password process test', () => {
  afterEach(async () => {
    jest.resetAllMocks();

    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be able to finish the forgot password process', async () => {
    const user = userFactory();
    await userRepo.create(user);

    await tokenHandler.sendToken({
      id: user.id,
      content: 'content',
      expiresIn: Date.now() + 10000,
      type: 'forgot_token',
    });

    const finishForgotPasswordService = new FinishForgotPasswordService(
      userRepo,
      userHandler,
      searchForUser,
      tokenHandler,
      miscHandler,
      bcryptHandler,
    );

    await finishForgotPasswordService.exec(
      user.id,
      user.email.value,
      'new password',
    );

    const existentUser = await userRepo.find({ email: user.email.value });
    const existentUserInCache = await userHandler.getUser(user.email.value);

    expect(existentUser?.password.value).toEqual('hashed');
    expect(existentUserInCache?.password.value).toEqual('hashed');
  });
});
