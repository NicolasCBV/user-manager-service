import { Email } from '@app/entities/user/email';
import { Name } from '@app/entities/user/name';
import { Password } from '@app/entities/user/password';
import { UserInCache } from '@src/app/entities/userInCache/userInCache';

type IOverride = Partial<UserInCache>;

export function userInCacheFactory(override: IOverride = {}) {
  return new UserInCache({
    id: 'default id',
    name: new Name('default name'),
    email: new Email('default email'),
    password: new Password('123456'),
    ...override,
  });
}
