import { userFactory } from '@test/fatories/user';
import { UserInCache } from './userInCache';

describe('User cache test', () => {
  it('should create user', () => {
    const user = userFactory();

    expect(new UserInCache(user)).toBeInstanceOf(UserInCache);
  });

  it('test new equal method', () => {
    const user = new UserInCache(userFactory({ id: '1' }));
    const sameUser = user;
    const differentUser = new UserInCache(userFactory({ id: '2' }));

    expect(user.isEqual(sameUser)).toBeTruthy();
    expect(user.isEqual(differentUser)).toBeFalsy();
  });
});
