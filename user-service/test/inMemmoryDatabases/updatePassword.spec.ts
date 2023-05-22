import { User } from '@app/entities/user/_user';
import { userFactory } from '@test/fatories/user';
import { InMemmoryUser } from './user';

describe('Update password on in memmory user tests', () => {
  it('should update password user', async () => {
    const userInMemmoryDB = new InMemmoryUser();
    const user = userFactory();

    userInMemmoryDB.users.push(user);

    const userToFind = userInMemmoryDB.users.find(
      (_user) => _user.email.value === user.email.value,
    ) as User;

    await userInMemmoryDB.updatePassword(userToFind.id, 'default password');

    const userOnDB = userInMemmoryDB.users.find(
      (_user) => _user.id === user.id,
    );

    expect(userOnDB?.password.value).toEqual('default password');
  });
});
