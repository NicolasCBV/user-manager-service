import { Injectable } from '@nestjs/common';
import { EmailAdapter } from '@src/app/adapters/email';
import { OTP } from '@src/app/entities/OTP/_OTP';
import { UserOnObjects } from '@src/app/mappers/userInObjects';
import { generateRandomCharacters } from '@infra/helpers/generateRandomCharacters';
import { GenTokensService } from './genTokens.service';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import { OTPHandlerContract } from '@infra/storages/cache/contract/OTPHandler';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { TFARecommendedTitle, TFATemplate } from '@templates/TFA';
import { CryptAdapter } from '../../adapters/crypt';
import { DefaultService } from '../defaultService';

interface IErrors {
  unauthorized: Error;
}

@Injectable()
export class AuthService extends DefaultService<IErrors> {
  constructor(
    private readonly genTokens: GenTokensService,
    private readonly crypt: CryptAdapter,
    private readonly tokenHandler: TokenHandlerContract,
    private readonly searchForUser: SearchUserManager,
    private readonly userHandler: UserHandlerContract,
    private readonly otpHandler: OTPHandlerContract,
    private readonly miscHandler: MiscellaneousHandlerContract,
    private readonly emailAdapter: EmailAdapter,
  ) {
    super({
      previsibleErrors: {
        unauthorized: new Error('Unathorized')
      }
    });
  }

  getExposedErrors() {
    const { previsibileErrors } = this.searchForUser;
    return {
      searchForUserErrors: previsibileErrors
    };
  }

  async validateUser(email: string, password: string): Promise<'OK' | null> {
    const user = await this.searchForUser.exec(email);

    if (!user) return null;

    const result = await this.crypt.compare(password, user.password.value);

    if (result) {
      const code = generateRandomCharacters();
      const codeHashed = await this.crypt.hash(code);

      const otp = new OTP({
        code: codeHashed,
        userIdentificator: `${this.userHandler.userKW}:${email}`,
      });

      await this.otpHandler.sendOTP(otp, email);

      await this.emailAdapter.send({
        from: `${process.env.NAME_SENDER as string}
        <${process.env.EMAIL_SENDER as string}>`,
        to: email,
        subject: `${
          (process.env.PROJECT_NAME as string) ?? ''
        } - ${TFARecommendedTitle}`,
        body: TFATemplate({
          code,
          name: user.name.value,
        }),
      });

      return 'OK';
    }

    return null;
  }

  async login(
    userEmail: string,
    code: string,
    deviceId?: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const user = await this.searchForUser.exec(userEmail)

    const otp = await this.otpHandler.getOTP(userEmail);
    if (!otp) throw this.previsibileErrors.unauthorized;

    const result = await this.crypt.compare(code, otp.code);
    if (!result) throw this.previsibileErrors.unauthorized;

    const deviceIdHashed = deviceId ? await this.crypt.hash(deviceId) : null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, id, email, ...rest } = UserOnObjects.toObject(user);

    const { refresh_token, access_token } = this.genTokens.exec({
      userId: user.id,
      deviceId: deviceIdHashed,
      email: user.email.value,
      userData: rest,
    });

    await this.miscHandler.del(`${this.otpHandler.otpKW}:${user.email.value}`);

    await this.tokenHandler.throwMainAuthTokens(
      id,
      access_token,
      refresh_token,
    );

    return {
      access_token,
      refresh_token,
    };
  }
}
