import { Injectable } from '@nestjs/common';
import { generateRandomCharacters } from '@infra/helpers/generateRandomCharacters';
import { CryptAdapter } from '../../adapters/crypt';
import { EmailAdapter } from '../../adapters/email';
import { OTP } from '../../entities/OTP/_OTP';
import { UsersRepositories } from '../../repositories/users';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { createAccountRecommendedTitle, createUserTemplate } from '@templates/createAccount';
import { UserInCache } from '@src/app/entities/userInCache/userInCache';
import { OTPHandlerContract } from '@infra/storages/cache/contract/OTPHandler';
import { randomUUID } from 'node:crypto';
import { User } from '@src/app/entities/user/_user';

@Injectable()
export class LaunchOTPService {
  constructor(
    private readonly userRepo: UsersRepositories,
    private readonly crypt: CryptAdapter,
    private readonly email: EmailAdapter,
    private readonly userHandler: UserHandlerContract,
    private readonly otpHandler: OTPHandlerContract,
  ) {}

  private async isSigining(email: string): Promise<UserInCache> {
    const userOnDatabase = await this.userRepo.exist({ email });
    if (userOnDatabase) throw new Error('The entitie already exist');

    const userOnCacheMemory = await this.userHandler.getUser(email);
    if (!userOnCacheMemory) throw new Error('This user was not triggered');

    return userOnCacheMemory;
  }

  private async isLoging(email: string): Promise<User> {
    const userOnDatabase = await this.userRepo.find({ email });
    if (!userOnDatabase) throw new Error('This user should not launch OTP');

    return userOnDatabase;
  }

  async exec(email: string, isLoging = false): Promise<string> {
    // Check data
    const user: User | UserInCache = isLoging
      ? await this.isLoging(email)
      : await this.isSigining(email);

    const otp = await this.otpHandler.getOTP(email);
    if (!otp) throw new Error("This user doesn't requested one OTP");

    // Validate OTP time
    const timeToExpire = parseInt(process.env.OTP_TIME ?? '120000');

    const minTimeToLaunch = otp.createdAt.getTime() + 1000 * 30; // 30 secs
    const maxTimeToLauch = otp.createdAt.getTime() + timeToExpire;

    if (Date.now() < minTimeToLaunch || Date.now() > maxTimeToLauch)
      throw new Error('This user should not launch OTP');

    // Create OTP
    const code = generateRandomCharacters();
    const codeHashed = await this.crypt.hash(code);
    const newOTP = new OTP({
      userIdentificator: `${this.userHandler.userKW}:${email}`,
      code: codeHashed,
    });

    // gen cancel key
    const cancelKey = randomUUID();
    const cancelKeyHashed = await this.crypt.hash(cancelKey);
    const cancelKeyOTP = new OTP({
      userIdentificator: `${this.userHandler.userKW}:${email}`,
      code: cancelKeyHashed,
    });

    // Launch OTP
    const TTL = !isLoging
      ? Math.floor(parseInt(process.env.OTP_TIME ?? '120000') / 1000)
      : 1000 * 60 * 60 * 24;
    await this.userHandler.resendOTPForUser(
      user.email.value,
      user.name.value,
      TTL,
      newOTP,
      cancelKeyOTP,
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

    return cancelKey;
  }
}
