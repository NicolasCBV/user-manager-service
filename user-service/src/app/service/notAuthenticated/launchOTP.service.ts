import { Injectable } from '@nestjs/common';
import { generateRandomCharacters } from '@intra/helpers/generateRandomCharacters';
import { CryptAdapter } from '../../adapters/crypt';
import { EmailAdapter } from '../../adapters/email';
import { OTP } from '../../entities/OTP/_OTP';
import { UsersRepositories } from '../../repositories/users';
import { UserHandlerContract } from '@src/intra/storages/cache/contract/userHandler';
import { createUserTemplate } from '@templates/createAccount';
import { UserInCache } from '@src/app/entities/userInCache/userInCache';
import { SearchUserManager } from '@src/intra/storages/search/searchUserManager.service';
import { OTPHandlerContract } from '@src/intra/storages/cache/contract/OTPHandler';
import { randomUUID } from 'node:crypto';

@Injectable()
export class LaunchOTPService {
  constructor(
    private readonly userRepo: UsersRepositories,
    private readonly searchUser: SearchUserManager,
    private readonly crypt: CryptAdapter,
    private readonly email: EmailAdapter,
    private readonly userHandler: UserHandlerContract,
    private readonly otpHandler: OTPHandlerContract,
  ) {}

  private async isSigining(email: string): Promise<UserInCache> {
    const userOnDatabase = await this.userRepo.exist({ email });
    if (userOnDatabase) 
      throw new Error('The entitie already exist');

    const userOnCacheMemmory = await this.userHandler.getUser(email);
    if (!userOnCacheMemmory)
      throw new Error('This user was not triggered');

    return userOnCacheMemmory;
  }

  async exec(email: string, isLoging = false): Promise<string> {
    // Check data
    let userOnCacheMemmory: UserInCache;

    if (!isLoging) 
      userOnCacheMemmory = await this.isSigining(email);
    else 
      userOnCacheMemmory = await this.searchUser.exec(email);

    const otp = await this.otpHandler.getOTP(email);
    if (!otp) 
      throw new Error("This user doesn't requested one OTP")

    // Validate if OTP
    const timeToExpire = parseInt(process.env.OTP_TIME ?? "120000");

    const minTimeToLaunch = otp.createdAt.getTime() + 1000 * 30; // 30 secs
    const maxTimeToLauch = otp.createdAt.getTime() + timeToExpire;

    if (
      Date.now() < minTimeToLaunch || 
      Date.now() > maxTimeToLauch
    )
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
      userOnCacheMemmory, 
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
      } - Verificação de duas etapas`,
      body: createUserTemplate({
        code,
        name: userOnCacheMemmory.name.value,
      }),
    });

    return cancelKey;
  }
}
