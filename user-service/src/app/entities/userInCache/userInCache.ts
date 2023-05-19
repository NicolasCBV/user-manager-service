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

  set cachedAt(cachedAt: Date) {
    this._cachedAt = cachedAt;
  }

  get cachedAt(): Date {
    return this._cachedAt;
  }
}
