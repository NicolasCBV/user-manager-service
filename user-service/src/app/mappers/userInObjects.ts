import { Replace } from '@infra/helpers/replace';
import { Description } from '../entities/user/description';
import { Email } from '../entities/user/email';
import { Name } from '../entities/user/name';
import { Password } from '../entities/user/password';
import { User } from '../entities/user/_user';

export interface UserJSONObject {
  _id: string;
  props: {
    name: { name: string };
    email: { email: string };
    description?: { description: string } | null;
    password: { password: string };
    imageUrl?: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UserObject {
  id: string;
  name: string;
  email: string;
  description?: string | null;
  password: string;
  imageUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserOnClass = Replace<UserObject, { id?: string }>;

export class UserOnObjects {
  static toObject(user: User): UserObject {
    return {
      id: user.id,
      name: user.name.value,
      email: user.email.value,
      description: user.description ? user.description.value : user.description,
      password: user.password.value,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toClass(user: UserOnClass): User {
    return new User(
      {
        name: new Name(user.name),
        email: new Email(user.email),
        description:
          user.description !== null && typeof user.description === 'string'
            ? new Description(user.description)
            : user.description,
        password: new Password(user.password),
        imageUrl: user.imageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      user.id,
    );
  }

  static fromJsonToClass(user: UserJSONObject): User {
    return new User(
      {
        name: new Name(user.props.name.name),
        email: new Email(user.props.email.email),
        description:
          user.props.description && typeof user.props.description === 'object'
            ? new Description(user.props.description.description)
            : user.props.description,
        password: new Password(user.props.password.password),
        imageUrl: user.props.imageUrl,
        createdAt: new Date(user.props.createdAt),
        updatedAt: new Date(user.props.updatedAt),
      },
      user._id,
    );
  }
}
