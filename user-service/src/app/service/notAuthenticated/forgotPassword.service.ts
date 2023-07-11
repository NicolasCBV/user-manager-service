import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import {
  forgotPasswordRecommendedTitle,
  forgotPasswordTemplate,
} from '@templates/forgotPassword';
import { CryptAdapter } from '../../adapters/crypt';
import { EmailAdapter } from '../../adapters/email';
import { randomUUID } from 'crypto';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly tokenHandler: TokenHandlerContract,
    private readonly searchForUser: SearchUserManager,
    private readonly jwtService: JwtService,
    private readonly crypt: CryptAdapter,
    private readonly email: EmailAdapter,
  ) {}

  getExposedErrors() {
    const { previsibileErrors } = this.searchForUser
    return {
      entitieNotExist: this.tokenHandler.entitieNotExistError,
      entitieExist: this.tokenHandler.entitieError,
      searchForUserErrors: previsibileErrors
    }
  }

  async exec(email: string, deviceId?: string) {
    const user = await this.searchForUser.exec(email);

    const sub = randomUUID();
    const deviceIdHashed = deviceId ? await this.crypt.hash(deviceId) : null;

    const token = this.jwtService.sign(
      {
        sub,
        email,
        type: this.tokenHandler.tokenTypes.forgotToken,
        deviceId: deviceIdHashed,
      },
      {
        secret: process.env.FORGOT_TOKEN_KEY as string,
        expiresIn: parseInt(process.env.FORGOT_TOKEN_EXPIRES ?? '120000'),
      },
    );

    await this.tokenHandler.sendToken({
      id: sub,
      type: this.tokenHandler.tokenTypes.forgotToken,
      content: token,
      expiresIn: parseInt(process.env.FORGOT_TOKEN_EXPIRES ?? '120000'),
    });

    const url = `${process.env.CLIENT_URL}/forgot?token=${sub}`;

    await this.email.send({
      from: `${process.env.NAME_SENDER as string}
      <${process.env.EMAIL_SENDER as string}>`,
      to: email,
      subject: `${
        (process.env.PROJECT_NAME as string) ?? ''
      } - ${forgotPasswordRecommendedTitle}`,
      body: forgotPasswordTemplate({
        name: user.name.value,
        link: url,
      }),
    });
  }
}
