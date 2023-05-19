import { userFactory } from '@test/fatories/user';
import { randomUUID } from 'crypto';
import { UserInCache } from '../entities/userInCache/userInCache';
import { UserOnCache } from './UserOnCache';

describe('User on cache tests', () => {
  it('should be able to convert json to class', () => {
    const user = userFactory({
      description: null,
    });

    const userOnCache = new UserInCache(user);
    const rawUser = JSON.stringify(UserOnCache.toObject(userOnCache));

    const userConverted = UserOnCache.fromJsonToClass(JSON.parse(rawUser));

    expect(userConverted.id).toEqual(user.id);
    expect(userConverted.description).toEqual(user.description);
    expect(userConverted.createdAt).toEqual(user.createdAt);
    expect(userConverted.updatedAt).toEqual(user.updatedAt);
    expect(userConverted.cachedAt).toEqual(userOnCache.cachedAt);
  });

  it('should be able to convert the entitie user on cache in user', () => {
    const user = userFactory({
      description: null,
    });

    const userOnCache = new UserInCache(user);

    const userConverted = UserOnCache.toUserEntitie(userOnCache);

    const newId = randomUUID();
    const userConvertedWithDifferentId = UserOnCache.toUserEntitie(
      userOnCache,
      newId,
    );

    expect(userConverted.id).toEqual(user.id);
    expect(userConvertedWithDifferentId.id).not.toEqual(user.id);
  });
});
