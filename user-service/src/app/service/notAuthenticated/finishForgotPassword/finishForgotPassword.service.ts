import { Injectable } from '@nestjs/common';
import { Password } from '@app/entities/user/password';
import { UserInCache } from '@app/entities/userInCache/userInCache';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { CryptAdapter } from '@app/adapters/crypt';
import { UsersRepositories } from '@app/repositories/users';
import { DefaultService } from '@app/service/defaultService';

export interface IFinishForgotPasswordProps {
  userRepo: UsersRepositories;
  userHandler: UserHandlerContract;
  searchForUser: SearchUserManager;
  tokenHandler: TokenHandlerContract;
  miscHandler: MiscellaneousHandlerContract;
  crypt: CryptAdapter;
}

interface IErrors {
  unauthorized: Error;
}

interface IFinishForgotPasswordExec {
  sub: string;
  email: string;
  password: string;
}

@Injectable()
export class FinishForgotPasswordService extends DefaultService<IErrors> {
  constructor(
    private readonly userRepo: UsersRepositories,
    private readonly userHandler: UserHandlerContract,
    private readonly searchForUser: SearchUserManager,
    private readonly tokenHandler: TokenHandlerContract,
    private readonly miscHandler: MiscellaneousHandlerContract,
    private readonly crypt: CryptAdapter,
  ) {
    super({
      previsibleErrors: {
        unauthorized: new Error('Unauthorized'),
      },
    });
  }

  async exec({
    sub,
    email,
    password,
  }: IFinishForgotPasswordExec): Promise<void> {
    const oldUser = await this.searchForUser.exec({ email });
    const token = await this.tokenHandler.exist(
      sub,
      this.tokenHandler.tokenTypes.forgotToken,
    );

    if (!token) throw this.previsibileErrors.unauthorized;

    const passwordHashed = await this.crypt.hash(password);

    const tokenKey = `${this.userHandler.tokenKW}:${this.tokenHandler.tokenTypes.forgotToken}.${sub}`;
    await this.miscHandler.del(tokenKey);

    await this.userRepo.updatePassword(oldUser.id, passwordHashed);

    const newUser = new UserInCache(oldUser);
    newUser.password = new Password(passwordHashed);
    const newTTL = 1000 * 60 * 60 * 24;

    await this.userHandler.forceUpdate(oldUser, newUser, newTTL);
  }
}
