import { userFactory } from '@test/fatories/user';
import { User } from './_user';

describe('User test', () => {
  it('should create user', () => {
    const user = userFactory();

    expect(user).toBeInstanceOf(User);
  });
});
