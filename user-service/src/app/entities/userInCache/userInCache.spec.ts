import { userFactory } from '@test/fatories/user';
import { UserInCache } from './userInCache';

describe('User in memmory test', () => {
  it('should create user in memmory cache', () => {
    const user = userFactory();

    const userOnCache = new UserInCache(user);

    expect(userOnCache).toBeInstanceOf(UserInCache);
  });
});
