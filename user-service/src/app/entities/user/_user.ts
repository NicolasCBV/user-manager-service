import { randomUUID } from 'crypto';
import { Replace } from '@infra/helpers/replace';
import { Description } from './description';
import { Email } from './email';
import { Name } from './name';
import { Password } from './password';

export interface IUser {
  name: Name;
  email: Email;
  imageUrl?: string | null;
  description?: Description | null;
  password: Password;
  createdAt: Date;
  updatedAt: Date;
}

export type ICreateUserProcess = Replace<
  Replace<IUser, { createdAt?: Date }>,
  { updatedAt?: Date }
>;

export class User {
  private props: IUser;
  private _id: string;

  constructor(props: ICreateUserProcess, id?: string) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  public isEqual(user: User): Boolean {
    return user._id === this._id &&
      user.name.value === this.props.name.value &&
      user.email.value === this.props.email.value &&
      user?.description?.value === this.props?.description?.value &&
      user.imageUrl === this.props.imageUrl &&
      user.password === this.props.password &&
      user.updatedAt === this.props.updatedAt &&
      user.createdAt === this.props.createdAt;
  }

  // id property
  get id(): string {
    return this._id;
  }

  // name property
  get name(): Name {
    return this.props.name;
  }

  set name(name: Name) {
    this.props.name = name;
  }

  // email property
  get email(): Email {
    return this.props.email;
  }

  set email(email: Email) {
    this.props.email = email;
  }

  // password property
  get password(): Password {
    return this.props.password;
  }

  set password(password: Password) {
    this.props.password = password;
  }

  // imageUrl property
  get imageUrl(): string | undefined | null {
    return this.props.imageUrl;
  }

  set imageUrl(imageUrl: string | undefined | null) {
    this.props.imageUrl = imageUrl;
  }

  // description property
  get description(): Description | undefined | null {
    return this.props?.description;
  }

  set description(description: Description | undefined | null) {
    this.props.description = description;
  }

  // createdAt property
  get createdAt(): Date {
    return this.props.createdAt;
  }

  // updatedAt property
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
