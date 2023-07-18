import { Injectable } from '@nestjs/common';
import { generateRandomCharacters } from '@infra/helpers/generateRandomCharacters';
import { CryptAdapter } from '@app/adapters/crypt';
import { EmailAdapter } from '@app/adapters/email';
import { OTP } from '@app/entities/OTP/_OTP';
import { UsersRepositories } from '@app/repositories/users';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import {
  createAccountRecommendedTitle,
  createUserTemplate,
} from '@templates/createAccount';
import { UserInCache } from '@app/entities/userInCache/userInCache';
import { OTPHandlerContract } from '@infra/storages/cache/contract/OTPHandler';
import { randomUUID } from 'node:crypto';
import { User } from '@app/entities/user/_user';
import { DefaultService } from '@app/service/defaultService';

interface IErrors {
  indisponible: Error;
}

interface ILaunchOTPExec {
  email: string;
  isLoging?: boolean;
}

@Injectable()
export class RelaunchOTPService extends DefaultService<IErrors> {
  constructor(
    private readonly userRepo: UsersRepositories,
    private readonly crypt: CryptAdapter,
    private readonly email: EmailAdapter,
    private readonly userHandler: UserHandlerContract,
    private readonly otpHandler: OTPHandlerContract,
  ) {
    super({
      previsibleErrors: {
        indisponible: new Error('This feature is indisponible.'),
      },
    });
  }

  private async setCancelKey(email: string) {
    const cancelKey = randomUUID();
    const cancelKeyHashed = await this.crypt.hash(cancelKey);
    const cancelKeyOTP = new OTP({
      userIdentificator: `${this.userHandler.userKW}:${email}`,
      code: cancelKeyHashed,
    });

    return { cancelKey: cancelKeyOTP, code: cancelKey };
  }

  private async isSigining(email: string): Promise<UserInCache> {
    const userOnDatabase = await this.userRepo.exist({ email });
    if (userOnDatabase) throw this.previsibileErrors.indisponible;

    const userOnCacheMemory = await this.userHandler.getUser(email);
    if (!userOnCacheMemory) throw this.previsibileErrors.indisponible;

    return userOnCacheMemory;
  }

  private async isLoging(email: string): Promise<User> {
    const userOnDatabase = await this.userRepo.find({ email });
    if (!userOnDatabase) throw this.previsibileErrors.indisponible;

    return userOnDatabase;
  }

  async exec({ email, isLoging = false }: ILaunchOTPExec): Promise<string | undefined> {
    // Check data
    const user: User | UserInCache = isLoging
      ? await this.isLoging(email)
      : await this.isSigining(email);

    const otp = await this.otpHandler.getOTP(email);
    if (!otp) throw this.previsibileErrors.indisponible;

    // Validate OTP time
    const timeToExpire = parseInt(process.env.OTP_TIME ?? '120000');

    const minTimeToLaunch = otp.createdAt.getTime() + 1000 * 30;
    const maxTimeToLauch = otp.createdAt.getTime() + timeToExpire;

    if (Date.now() < minTimeToLaunch || Date.now() > maxTimeToLauch)
      throw this.previsibileErrors.indisponible;

    // Create OTP
    const code = generateRandomCharacters();
    const codeHashed = await this.crypt.hash(code);
    const newOTP = new OTP({
      userIdentificator: `${this.userHandler.userKW}:${email}`,
      code: codeHashed,
    });

    // gen cancel key
    const genKey = isLoging 
        ? undefined 
        : await this.setCancelKey(email);

    // Launch OTP
    const TTL = !isLoging
      ? Math.floor(parseInt(process.env.OTP_TIME ?? '120000') / 1000)
      : 1000 * 60 * 60 * 24;
    await this.userHandler.resendOTPForUser(
      user.email.value,
      user.name.value,
      TTL,
      newOTP,
      genKey?.cancelKey,
    );

    // Send email
    await this.email.send({
      from: `${process.env.NAME_SENDER as string}
      <${process.env.EMAIL_SENDER as string}>`,
      to: email,
      subject: `${
        (process.env.PROJECT_NAME as string) ?? ''
      } - ${createAccountRecommendedTitle}`,
      body: createUserTemplate({
        code,
        name: user.name.value,
      }),
    });

    return !isLoging ? genKey?.code : undefined;
  }
}
