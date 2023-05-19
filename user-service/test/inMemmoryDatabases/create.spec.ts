import { User } from '@app/entities/user/_user';
import { userFactory } from '@test/fatories/user';
import { InMemmoryUser } from './user';

describe('In memmory database tests', () => {
  it('should create user', async () => {
    const userInMemmoryDB = new InMemmoryUser();
    const user = userFactory();

    await userInMemmoryDB.create(user);

    const userOnDB = userInMemmoryDB.users.find(
      (_user) => _user.id === user.id,
    );

    expect(userOnDB).toBeInstanceOf(User);
  });

  it('should throw one error - User already exist', async () => {
    const userInMemmoryDB = new InMemmoryUser();
    const user = userFactory();

    const createSameUsers = async () => {
      await userInMemmoryDB.create(user);
      await userInMemmoryDB.create(user);
    };

    expect(createSameUsers).rejects.toThrow();
  });
});
