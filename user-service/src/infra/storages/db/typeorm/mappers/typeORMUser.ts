import { Description } from '@src/app/entities/user/description';
import { Email } from '@src/app/entities/user/email';
import { Name } from '@src/app/entities/user/name';
import { Password } from '@src/app/entities/user/password';
import { User } from '@src/app/entities/user/_user';
import { TypeORMUser } from '../entities/user/users.entity';

export class TypeORMUserMapper {
  static toTypeORM(user: User) {
    return {
      id: user.id,
      name: user.name.value,
      email: user.email.value,
      password: user.password.value,
      imageUrl: user.imageUrl ?? undefined,
      description: user?.description?.value ?? undefined,
      level: user.level,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toUserEntitie(user: TypeORMUser): User {
    return new User(
      {
        name: new Name(user.name),
        email: new Email(user.email),
        description:
          typeof user.description === 'string'
            ? new Description(user.description)
            : null,
        password: new Password(user.password),
        imageUrl: user.imageUrl,
        level: user.level,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      user.id,
    );
  }
}
