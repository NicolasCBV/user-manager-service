import { userFactory } from '@test/fatories/user';
import { InMemmoryUser } from './user';

describe('Exist user test', () => {
  it('should be able to test exist function', async () => {
    const userDatabase = new InMemmoryUser();

    const user = userFactory();

    userDatabase.users.push(user);

    const res = await userDatabase.exist({ name: user.name.value });

    expect(res).toEqual(1);
  });
});
