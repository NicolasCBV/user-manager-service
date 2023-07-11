import { Injectable } from '@nestjs/common';
import { Password } from '@src/app/entities/user/password';
import { UserInCache } from '@src/app/entities/userInCache/userInCache';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { CryptAdapter } from '../../adapters/crypt';
import { UsersRepositories } from '../../repositories/users';
import { DefaultService } from '../defaultService';

interface IErrors {
  unauthorized: Error;
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

  getExposedErrors() {
    const { previsibileErrors } = this.searchForUser;
    return {
      searchForUserErrors: previsibileErrors,
    };
  }

  async exec(sub: string, email: string, password: string): Promise<void> {
    const oldUser = await this.searchForUser.exec(email);
    const token = await this.tokenHandler.exist(
      sub,
      this.tokenHandler.tokenTypes.forgotToken,
    );

    if (!oldUser || !token) throw this.previsibileErrors.unauthorized;

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
