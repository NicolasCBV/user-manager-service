import { User } from '@app/entities/user/_user';
import { userFactory } from '@test/fatories/user';
import { InMemmoryUser } from './user';

describe('Update image on in memmory user tests', () => {
  it('should update image user', async () => {
    const userInMemmoryDB = new InMemmoryUser();
    const user = userFactory();

    userInMemmoryDB.users.push(user);

    const userToFind = userInMemmoryDB.users.find(
      (_user) => _user.email.value === user.email.value,
    ) as User;

    await userInMemmoryDB.uploadImage(userToFind.id, 'default url');

    const userOnDB = userInMemmoryDB.users.find(
      (_user) => _user.id === user.id,
    );

    expect(userOnDB?.imageUrl).toEqual('default url');
  });
});
