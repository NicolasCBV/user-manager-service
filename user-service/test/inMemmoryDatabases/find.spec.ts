import { User } from '@app/entities/user/_user';
import { userFactory } from '@test/fatories/user';
import { InMemmoryUser } from './user';

describe('Find user in memmory database tests', () => {
  it('should be able to find user on DB', async () => {
    const userInMemmoryDB = new InMemmoryUser();
    const user = userFactory();

    userInMemmoryDB.users.push(user);

    const userOnDB = await userInMemmoryDB.find({ id: user.id });

    expect(userOnDB).toBeInstanceOf(User);
  });

  it("should won't find user on DB", async () => {
    const userInMemmoryDB = new InMemmoryUser();
    const user = userFactory();

    const userOnDB = await userInMemmoryDB.find({ id: user.id });

    expect(userOnDB).toBeNull();
  });
});
