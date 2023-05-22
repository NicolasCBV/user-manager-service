import { userFactory } from '@test/fatories/user';
import { User } from '../entities/user/_user';
import { UserOnObjects } from './userInObjects';

describe('User in object tests', () => {
  it('should be able to convert on class', () => {
    const user = userFactory({
      description: null,
    });

    const rawUser = JSON.stringify(user);
    const convertedUser = UserOnObjects.fromJsonToClass(JSON.parse(rawUser));

    expect(convertedUser).toBeInstanceOf(User);
    expect(convertedUser.id).toEqual(user.id);
    expect(convertedUser.createdAt).toEqual(user.createdAt);
    expect(convertedUser.updatedAt).toEqual(user.updatedAt);
  });

  it('should be able to convert in object', () => {
    const user = userFactory({
      description: null,
    });

    const userObjt = UserOnObjects.toObject(user);

    expect(userObjt.id).toEqual(user.id);
    expect(userObjt.description).toEqual(user.description);
    expect(userObjt.imageUrl).toEqual(user.imageUrl);
  });

  it('should be able to convert from objects to class', () => {
    const user = userFactory({
      description: null,
    });

    const userObjt = UserOnObjects.toObject(user);
    const userClass = UserOnObjects.toClass(userObjt);

    expect(userClass).toEqual(user);
  });
});
