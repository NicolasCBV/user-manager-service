import { User } from '@src/app/entities/user/_user';
import { User as UserOnPrisma } from '@prisma/client';
import { Name } from '@src/app/entities/user/name';
import { Description } from '@src/app/entities/user/description';
import { Email } from '@src/app/entities/user/email';
import { Password } from '@src/app/entities/user/password';

export class PrismaUser {
  static toPrisma(user: User): UserOnPrisma {
    return {
      name: user.name.value,
      email: user.email.value,
      password: user.password.value,
      description: user.description?.value ?? null,
      imageUrl: user.imageUrl ?? null,
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toUserEntitie(user: UserOnPrisma): User {
    return new User(
      {
        name: new Name(user.name),
        email: new Email(user.email),
        password: new Password(user.password),
        description:
          typeof user.description === 'string'
            ? new Description(user.description)
            : null,
        imageUrl: user.imageUrl,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
      },
      user.id,
    );
  }
}
