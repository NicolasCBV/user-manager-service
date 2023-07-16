import { GenTokensService } from '../../genTokens.service';
import { Test } from '@nestjs/testing';
import { DatabaseCacheModule } from '@root/src/infra/storages/cache/cache.module';
import { DatabaseTestModule } from '@root/src/infra/storages/db/databaseTest.module';
import { AdaptersModule } from '@root/src/app/adapters/adapters.module';
import { CryptAdapter } from '@root/src/app/adapters/crypt';
import { UsersRepositories } from '@root/src/app/repositories/users';
import { UserHandlerContract } from '@root/src/infra/storages/cache/contract/userHandler';
import { OTPHandlerContract } from '@root/src/infra/storages/cache/contract/OTPHandler';
import { MiscellaneousHandlerContract } from '@root/src/infra/storages/cache/contract/miscellaneousHandler';
import { ValidateAccountService } from '../validateAccount.service';
import { JwtService } from '@nestjs/jwt';

export const getValidateAccountModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseTestModule, DatabaseCacheModule, AdaptersModule],
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
