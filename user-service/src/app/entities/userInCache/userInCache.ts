import { ICreateUserProcess, User } from '../user/_user';

type IProps = ICreateUserProcess & { cachedAt?: Date; id: string };

export class UserInCache extends User {
  private _cachedAt;

  constructor(data: User | IProps) {
    const props: ICreateUserProcess = {
      email: data.email,
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      password: data.password,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    super(props, data.id);

    this._cachedAt =
      !(data instanceof User) && data.cachedAt ? data.cachedAt : new Date();
  }

  public isEqual(user: UserInCache): boolean {
    return (
      user.id === this.id &&
      user.name.value === this.name.value &&
      user.email.value === this.email.value &&
      user?.description?.value === this.description?.value &&
      user.imageUrl === this.imageUrl &&
      user.password === this.password &&
      user.updatedAt === this.updatedAt &&
      user.createdAt === this.createdAt
    );
  }

  set cachedAt(cachedAt: Date) {
    this._cachedAt = cachedAt;
  }

  get cachedAt(): Date {
    return this._cachedAt;
  }
}
