import { Injectable } from '@nestjs/common';
import { UserOnCache } from '@app/mappers/UserOnCache';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { UserObject } from '@app/mappers/userInObjects';

type IUnsensitiveUserData = Omit<
  UserObject,
  'password' | 'phoneNumber' | 'email'
>;

interface IGetUserExec {
  email: string;
}

@Injectable()
export class GetUserService {
  constructor(private readonly searchManager: SearchUserManager) {}

  async exec({ email }: IGetUserExec): Promise<IUnsensitiveUserData | null> {
    const user = await this.searchManager.exec({ email }).catch((err) => {
      const { unauthorized } = this.searchManager.previsibileErrors;
      if (err.message === unauthorized.message) return null;
    });

    if (!user) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ['email']: _email, ...rest } = UserOnCache.toObject(user);

    return rest;
  }
}
