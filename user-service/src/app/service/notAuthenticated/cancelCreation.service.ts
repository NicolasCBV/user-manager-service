import { Injectable } from '@nestjs/common';
import { CryptAdapter } from '@src/app/adapters/crypt';
import { UsersRepositories } from '@src/app/repositories/users';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import { OTPHandlerContract } from '@infra/storages/cache/contract/OTPHandler';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { DefaultService } from '../defaultService';

interface IErrors {
  unauthorized: Error;
}

@Injectable()
export class CancelCreationService extends DefaultService<IErrors> {
  constructor(
    private readonly userHandler: UserHandlerContract,
    private readonly userRepo: UsersRepositories,
    private readonly otpHandler: OTPHandlerContract,
    private readonly miscHandler: MiscellaneousHandlerContract,
    private readonly crypt: CryptAdapter,
  ) {
    super({
      previsibleErrors: {
        unauthorized: new Error('Unauthorized')
      }
    });
  }

  async exec(email: string, cancelKey: string): Promise<void> {
    const cancelKeyOTP = await this.otpHandler.getCancelKeyOTP(email);
    if (!cancelKeyOTP) throw this.previsibileErrors.unauthorized;

    const userOnDatabase = await this.userRepo.exist({ email });
    const userOnCacheMemmory = await this.userHandler.getUser(email);
    if (!userOnCacheMemmory || userOnDatabase)
      throw this.previsibileErrors.unauthorized;

    const result = await this.crypt.compare(cancelKey, cancelKeyOTP.code);

    if (!result) throw this.previsibileErrors.unauthorized;

    await this.miscHandler.deleteAllUserDatas(
      userOnCacheMemmory.id,
      email,
      userOnCacheMemmory.name.value,
    );
  }
}
