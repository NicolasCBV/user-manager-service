import { Injectable } from '@nestjs/common';
import { generateRandomCharacters } from '@infra/helpers/generateRandomCharacters';
import { CryptAdapter } from '../../adapters/crypt';
import { EmailAdapter } from '../../adapters/email';
import { OTP } from '../../entities/OTP/_OTP';
import { UserInCache } from '../../entities/userInCache/userInCache';
import { UserOnObjects } from '../../mappers/userInObjects';
import { UsersRepositories } from '../../repositories/users';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { createAccountRecommendedTitle, createUserTemplate } from '@templates/createAccount';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import { randomUUID } from 'node:crypto';

interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userRepo: UsersRepositories,
    private readonly crypt: CryptAdapter,
    private readonly email: EmailAdapter,
    private readonly userHandler: UserHandlerContract,
    private readonly miscHandler: MiscellaneousHandlerContract,
  ) {}
  async exec(data: ICreateUser): Promise<string> {
    let userOnDatabase = await this.userHandler.existUser(
      data.email,
      data.name,
    );

    if (!userOnDatabase)
      userOnDatabase = Boolean(
        await this.userRepo.exist({
          email: data.email,
          name: data.name,
        }),
      );

    if (userOnDatabase) throw new Error('The entitie already exist.');

    // create user
    const password = await this.crypt.hash(data.password);
    const user = UserOnObjects.toClass({ ...data, password });

    // create OTP
    const code = generateRandomCharacters();
    const hashedCode = await this.crypt.hash(code);
    const otp = new OTP({
      userIdentificator: `${this.userHandler.userKW}:${data.email}`,
      code: hashedCode,
    });

    // create user on memmory cache
    const userOnCache = new UserInCache(user);

    // gen cancel key
    const cancelKey = randomUUID();
    const cancelKeyOTP = new OTP({
      userIdentificator: `${this.userHandler.userKW}:${data.email}`,
      code: await this.crypt.hash(cancelKey),
    });

    // start sigin stage
    await this.miscHandler.startUserSigin(userOnCache, otp, cancelKeyOTP);

    await this.email.send({
      from: `${process.env.NAME_SENDER as string}
      <${process.env.EMAIL_SENDER as string}>`,
      to: data.email,
      subject: `${
        (process.env.PROJECT_NAME as string) ?? ''
      } - ${createAccountRecommendedTitle}`,
      body: createUserTemplate({
        code,
        name: data.name,
      }),
    });

    return cancelKey;
  }
}
