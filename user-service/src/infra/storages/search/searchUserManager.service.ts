import { Injectable } from '@nestjs/common';
import { DefaultService } from '@root/src/app/service/defaultService';
import { UserInCache } from '@src/app/entities/userInCache/userInCache';
import { UsersRepositories } from '@src/app/repositories/users';
import { UserHandlerContract } from '../cache/contract/userHandler';

export interface ISearchUserManagerErrors {
  unauthorized: Error;
}

interface ISearchUserManagerExec {
  email: string;
}

@Injectable()
export class SearchUserManager extends DefaultService<ISearchUserManagerErrors> {
  static previsibleErrors = {
    unauthorized: new Error('Unauthorized'),
  };

  constructor(
    private readonly userHandler: UserHandlerContract,
    private readonly userRepo: UsersRepositories,
  ) {
    super({
      previsibleErrors: SearchUserManager.previsibleErrors,
    });
  }

  async exec({ email }: ISearchUserManagerExec): Promise<UserInCache> {
    let user: UserInCache | null = await this.userHandler.getUser(email);

    if (!user) {
      const searchedUser = await this.userRepo.find({ email });
      if (!searchedUser) throw this.previsibileErrors.unauthorized;

      const TTL = 1000 * 60 * 60 * 24;
      const userForCache = new UserInCache(searchedUser);
      await this.userHandler.sendUser(userForCache, TTL);

      user = userForCache;
    }

    return user;
  }
}
