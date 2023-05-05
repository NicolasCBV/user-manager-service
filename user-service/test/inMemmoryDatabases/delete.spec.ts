import { userFactory } from '@test/fatories/user';
import { InMemmoryUser } from './user';

describe('Delete user tests', () => {
  it('should be able to delete user on DB', async () => {
    const userInMemmoryDB = new InMemmoryUser();
    const user = userFactory();

    userInMemmoryDB.users.push(user);
    await userInMemmoryDB.delete(user.id);

    const userInDB = userInMemmoryDB.users.find(
      (_user) => _user.id === user.id,
    );

    expect(userInDB).toBeUndefined();
  });

  it("should throw error - User doesn't exist", async () => {
    const userInMemmoryDB = new InMemmoryUser();
    const user = userFactory();

    expect(userInMemmoryDB.delete(user.id)).rejects.toThrow();
  });
});
