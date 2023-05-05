import { Name } from '@app/entities/user/name';
import { User } from '@src/app/entities/user/_user';
import { userFactory } from '@test/fatories/user';
import { InMemmoryUser } from './user';

describe('Update in memmory user tests', () => {
  it('should update user', async () => {
    const userInMemmoryDB = new InMemmoryUser();
    const user = userFactory();

    userInMemmoryDB.users.push(user);

    user.name = new Name('new default name');

    const userToFind = userInMemmoryDB.users.find(
      (_user) => _user.email.value === user.email.value,
    ) as User;

    await userInMemmoryDB.update({
      id: userToFind?.id,
      name: user.name.value,
      description: user?.description?.value,
    });

    const userOnDB = userInMemmoryDB.users.find(
      (_user) => _user.id === user.id,
    );

    expect(userOnDB?.name.value).toEqual('new default name');
  });
});
