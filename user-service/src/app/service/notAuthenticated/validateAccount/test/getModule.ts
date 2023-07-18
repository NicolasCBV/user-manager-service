import { GenTokensService } from '../../genTokens.service';
import { Test } from '@nestjs/testing';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { AdaptersModule } from '@app/adapters/adapters.module';
import { CryptAdapter } from '@app/adapters/crypt';
import { UsersRepositories } from '@app/repositories/users';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { OTPHandlerContract } from '@infra/storages/cache/contract/OTPHandler';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import { ValidateAccountService } from '../validateAccount.service';
import { JwtService } from '@nestjs/jwt';

export const getValidateAccountModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseModule, DatabaseCacheModule, AdaptersModule],
    providers: [JwtService, GenTokensService, ValidateAccountService],
  }).compile();

  return {
    crypt: moduleRef.get(CryptAdapter),
    genTokens: moduleRef.get(GenTokensService),
    userRepo: moduleRef.get(UsersRepositories),
    userHandler: moduleRef.get(UserHandlerContract),
    OTPHandler: moduleRef.get(OTPHandlerContract),
    miscHandler: moduleRef.get(MiscellaneousHandlerContract),
    validateAccount: moduleRef.get(ValidateAccountService),
  };
};
