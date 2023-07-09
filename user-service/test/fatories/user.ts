import { Email } from '@app/entities/user/email';
import { Name } from '@app/entities/user/name';
import { Password } from '@app/entities/user/password';
import { User } from '@app/entities/user/_user';

type IOverride = Partial<User>;

export function userFactory(override: IOverride = {}) {
  return new User(
    {
      name: new Name('default name'),
      email: new Email('default email'),
      password: new Password('123456'),
      ...override,
    },
    override.id ?? 'default id',
  );
}
