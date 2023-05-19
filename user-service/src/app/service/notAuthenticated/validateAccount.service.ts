import { Injectable } from '@nestjs/common';
import { CryptAdapter } from '../../adapters/crypt';
import { UserOnCache } from '../../mappers/UserOnCache';
import { UserOnObjects } from '../../mappers/userInObjects';
import { UsersRepositories } from '../../repositories/users';
import { randomUUID } from 'crypto';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { OTPHandlerContract } from '@infra/storages/cache/contract/OTPHandler';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import { GenTokensService } from './genTokens.service';
import { UserInCache } from '@src/app/entities/userInCache/userInCache';

interface IValidateAccountProps {
  OTP: string;
  email: string;
  deviceId?: string;
}

@Injectable()
export class ValidateAccountService {
  constructor(
    private readonly genTokens: GenTokensService,
    private readonly userRepo: UsersRepositories,
    private readonly crypt: CryptAdapter,
    private readonly userHandler: UserHandlerContract,
    private readonly OTPHandler: OTPHandlerContract,
    private readonly miscHandler: MiscellaneousHandlerContract,
  ) {}

  async exec(data: IValidateAccountProps) {
    const userOnCache = await this.userHandler.getUser(data.email);
    if (!userOnCache) throw new Error('This user is not in validation step');

    const otp = await this.OTPHandler.getOTP(data.email);
    if (!otp) throw new Error('This user is not in validation step');

    const result = await this.crypt.compare(data.OTP, otp.code);
    if (!result) throw new Error('Unauthorized');

    const user = UserOnCache.toUserEntitie(userOnCache, randomUUID());
    await this.userRepo.create(user).catch((err) => {
      if (
        err.message.includes(
          'Unique constraint failed on the constraint: `users_name_email_key`',
        )
      )
        throw new Error('The entitie already exist.');

      throw err;
    });

    const deviceIdHashed = data.deviceId
      ? await this.crypt.hash(data.deviceId)
      : null;

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      password,
      ['id']: sub,
      email,
      ...userData
    } = UserOnObjects.toObject(user);

    const { refresh_token, access_token } = this.genTokens.exec({
      email,
      deviceId: deviceIdHashed,
      userId: sub,
      userData,
    });

    await this.miscHandler.endUserSigin(
      sub,
      access_token,
      refresh_token,
      new UserInCache(user),
    );

    return { access_token, refresh_token };
  }
}
