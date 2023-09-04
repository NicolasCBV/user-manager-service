import { Injectable } from '@nestjs/common';
import { OTP } from '@src/app/entities/OTP/_OTP';
import { UserOnObjects } from '@src/app/mappers/userInObjects';
import { generateRandomCharacters } from '@infra/helpers/generateRandomCharacters';
import { TFARecommendedTitle, TFATemplate } from '@templates/TFA';
import { DefaultService } from '@app/service/defaultService';
import { GenTokensService } from '../genTokens.service';
import { CryptAdapter } from '@app/adapters/crypt';
import { TokenHandlerContract } from '@infra/storages/cache/contract/tokenHandler';
import { SearchUserManager } from '@infra/storages/search/searchUserManager.service';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { OTPHandlerContract } from '@infra/storages/cache/contract/OTPHandler';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import { EmailAdapter } from '@app/adapters/email';
import { UsersRepositories } from '@app/repositories/users';

interface IErrors {
  unauthorized: Error;
}

interface IAuthValidateUser {
  email: string;
  password: string;
}

interface IAuthLogin {
  userEmail: string;
  code: string;
  deviceId?: string;
}

@Injectable()
export class AuthService extends DefaultService<IErrors> {
  constructor(
    private readonly genTokens: GenTokensService,
    private readonly crypt: CryptAdapter,
    private readonly tokenHandler: TokenHandlerContract,
    private readonly userRepo: UsersRepositories,
    private readonly searchForUser: SearchUserManager,
    private readonly userHandler: UserHandlerContract,
    private readonly otpHandler: OTPHandlerContract,
    private readonly miscHandler: MiscellaneousHandlerContract,
    private readonly emailAdapter: EmailAdapter,
  ) {
    super({
      previsibleErrors: {
        unauthorized: new Error('Unathorized'),
      },
    });
  }

  async validateUser({
    email,
    password,
  }: IAuthValidateUser): Promise<'OK' | null> {
    const user = await this.userRepo.find({ email });
    if (!user) return null;

    const result = await this.crypt.compare(password, user.password.value);
    if (result) {
      const code = generateRandomCharacters();
      const codeHashed = await this.crypt.hash(code);

      const otp = new OTP({
        code: codeHashed,
        userIdentificator: `${this.userHandler.userKW}:${email}`,
      });

      await this.otpHandler.sendOTP(otp, email, true);

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

  async login({ userEmail, code, deviceId }: IAuthLogin): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const user = await this.searchForUser.exec({ email: userEmail });

    const otp = await this.otpHandler.getOTP(userEmail, true);
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

    await this.miscHandler.del(
      `auth:${this.otpHandler.otpKW}:${user.email.value}`,
    );

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
