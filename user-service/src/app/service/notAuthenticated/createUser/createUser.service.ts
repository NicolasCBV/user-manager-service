import { Injectable } from '@nestjs/common';
import { generateRandomCharacters } from '@infra/helpers/generateRandomCharacters';
import { CryptAdapter } from '@app/adapters/crypt';
import { EmailAdapter } from '@app/adapters/email';
import { OTP } from '@app/entities/OTP/_OTP';
import { UserInCache } from '@app/entities/userInCache/userInCache';
import { UserOnObjects } from '@app/mappers/userInObjects';
import { UsersRepositories } from '@app/repositories/users';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import {
  createAccountRecommendedTitle,
  createUserTemplate,
} from '@templates/createAccount';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import { randomUUID } from 'node:crypto';
import { DefaultService } from '@app/service/defaultService';

export interface ICreateUserProps {
  userRepo: UsersRepositories;
  crypt: CryptAdapter;
  email: EmailAdapter;
  userHandler: UserHandlerContract;
  miscHandler: MiscellaneousHandlerContract;
}

interface IErrors {
  userAlreadyExist: Error;
}

interface ICreateUserExec {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class CreateUserService extends DefaultService<IErrors> {
  constructor(
    private readonly userRepo: UsersRepositories,
    private readonly crypt: CryptAdapter,
    private readonly email: EmailAdapter,
    private readonly userHandler: UserHandlerContract,
    private readonly miscHandler: MiscellaneousHandlerContract,
  ) {
    super({
      previsibleErrors: {
        userAlreadyExist: new Error('The entitie already exist.'),
      },
    });
  }
  async exec(data: ICreateUserExec): Promise<string> {
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

    if (userOnDatabase) throw this.previsibileErrors.userAlreadyExist;

    const password = await this.crypt.hash(data.password);
    const user = UserOnObjects.toClass({ ...data, password, level: 0 });

    const code = generateRandomCharacters();
    const hashedCode = await this.crypt.hash(code);
    const otp = new OTP({
      userIdentificator: `${this.userHandler.userKW}:${data.email}`,
      code: hashedCode,
    });

    const userOnCache = new UserInCache(user);

    const cancelKey = randomUUID();
    const cancelKeyOTP = new OTP({
      userIdentificator: `${this.userHandler.userKW}:${data.email}`,
      code: await this.crypt.hash(cancelKey),
    });

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
