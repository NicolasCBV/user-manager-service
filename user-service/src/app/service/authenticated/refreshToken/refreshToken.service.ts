import { Injectable } from '@nestjs/common';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { IDefaultPropsJwt } from '@app/auth/jwt.core';
import { UserOnObjects } from '@app/mappers/userInObjects';
import { GenTokensService } from '@app/service/notAuthenticated/genTokens.service';
import { DefaultService } from '../../defaultService';

interface IErrors {
  wrongToken: Error;
}

interface IRefreshTokenExec {
  tokenData: IDefaultPropsJwt;
}

@Injectable()
export class RefreshTokenService extends DefaultService<IErrors> {
  constructor(
    private readonly genTokens: GenTokensService,
    private readonly tokenHandler: TokenHandlerContract,
    private readonly searchForUser: SearchUserManager,
  ) {
    super({
      previsibleErrors: {
        wrongToken: new Error('Wrong token'),
      },
    });
  }

  async exec({ tokenData }: IRefreshTokenExec) {
    const user = await this.searchForUser.exec({
      email: tokenData.email,
    });
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      password,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      id,
      ...userData
    } = UserOnObjects.toObject(user);

    const { access_token, refresh_token } = this.genTokens.exec({
      userId: user.id,
      deviceId: tokenData.deviceId ?? null,
      email: user.email.value,
      userData,
    });

    await this.tokenHandler.throwMainAuthTokens(
      user.id,
      access_token,
      refresh_token,
    );

    return {
      access_token,
      refresh_token,
    };
  }
}
