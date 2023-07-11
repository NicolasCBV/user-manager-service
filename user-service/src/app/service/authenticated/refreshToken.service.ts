import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { IDefaultPropsJwt } from '../../auth/jwt.core';
import { UserOnObjects } from '../../mappers/userInObjects';
import { CheckFingerprintService } from '../notAuthenticated/checkFingerprint.service';
import { GenTokensService } from '../notAuthenticated/genTokens.service';
import { DefaultService } from '../defaultService';

interface IErrors {
  wrongToken: Error;
}

@Injectable()
export class RefreshTokenService extends DefaultService<IErrors> {
  constructor(
    private readonly genTokens: GenTokensService,
    private readonly tokenHandler: TokenHandlerContract,
    private readonly searchForUser: SearchUserManager,
    private readonly jwtService: JwtService,
    private readonly checkFingerprintService: CheckFingerprintService,
  ) {
    super({
      previsibleErrors: {
        wrongToken: new Error('Wrong token')
      }
    })
  }

  getExposedErrors() {
    return {
      checkFingerprintErrors: this.checkFingerprintService.previsibileErrors,
      searchForUserErrors: this.searchForUser.previsibileErrors
    }
  }

  async exec(refreshToken: string, deviceId?: string) {
    const tokenData = (await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY as string,
    })) as IDefaultPropsJwt;

    const existentToken = await this.tokenHandler.getToken(
      tokenData.sub,
      this.tokenHandler.tokenTypes.refreshToken,
    );
    if (!existentToken || existentToken !== refreshToken)
      throw this.previsibileErrors.wrongToken;

    await this.checkFingerprintService.exec(deviceId, tokenData.deviceId);

    const user = await this.searchForUser.exec(tokenData.email);

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
