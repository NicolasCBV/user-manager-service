import { userFactory } from '@test/fatories/user';
import { User } from './_user';

describe('User test', () => {
  it('should create user', () => {
    const user = userFactory();

    expect(user).toBeInstanceOf(User);
  });

  it('test new equal method', () => {
    const user = userFactory({ id: '1' });
    const sameUser = user;
    const differentUser = userFactory({ id: '2' });

    expect(user.isEqual(sameUser)).toBeTruthy();
    expect(user.isEqual(differentUser)).toBeFalsy();
  });
});
