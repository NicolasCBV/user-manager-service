import { Description } from '../entities/user/description';
import { Email } from '../entities/user/email';
import { Name } from '../entities/user/name';
import { Password } from '../entities/user/password';
import { User } from '../entities/user/_user';
import { UserInCache } from '../entities/userInCache/userInCache';

interface IUserInCacheObjt {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  description?: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  cachedAt: Date;
}

interface IUserInJson {
  id: string;
  name: string;
  email: string;
  description?: string | null;
  password: string;
  imageUrl?: string | null;
  phoneNumber?: string | null;
  createdAt: string;
  updatedAt: string;
  cachedAt: string;
}

export class UserOnCache {
  static toObject(user: UserInCache): IUserInCacheObjt {
    return {
      id: user.id,
      name: user.name.value,
      email: user.email.value,
      description: user.description ? user.description.value : user.description,
      password: user.password.value,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      cachedAt: user.cachedAt,
    };
  }

  static fromJsonToClass(user: IUserInJson): UserInCache {
    return new UserInCache({
      id: user.id,
      name: new Name(user.name),
      email: new Email(user.email),
      description:
        typeof user.description === 'string'
          ? new Description(user.description)
          : user.description,
      password: new Password(user.password),
      imageUrl: user.imageUrl,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
      cachedAt: new Date(user.cachedAt),
    });
  }

  static toUserEntitie(user: UserInCache, id?: string): User {
    return new User(
      {
        name: user.name,
        email: user.email,
        password: user.password,
        description: user.description,
        imageUrl: user.imageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      id ?? user.id,
    );
  }
}
