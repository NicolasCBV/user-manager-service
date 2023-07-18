import { Email } from '@app/entities/user/email';
import { Name } from '@app/entities/user/name';
import { Password } from '@app/entities/user/password';
import { User } from '@app/entities/user/_user';

type IOverride = Partial<User>;

export function userFactory(override: IOverride = {}) {
  return new User(
    {
      name: new Name('default name'),
      email: new Email('default@email.com'),
      password: new Password('1234Df'),
      ...override,
    },
    override.id ?? 'default id',
  );
}
