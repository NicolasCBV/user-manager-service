import { Test } from '@nestjs/testing';
import { UsersRepositories } from '@root/src/app/repositories/users';
import { ApiModule } from '@root/src/infra/api/api.module';
import { ImageContract } from '@root/src/infra/api/contracts/imageContract';
import { DatabaseCacheModule } from '@root/src/infra/storages/cache/cache.module';
import { UserHandlerContract } from '@root/src/infra/storages/cache/contract/userHandler';
import { DatabaseTestModule } from '@root/src/infra/storages/db/databaseTest.module';
import { UploadImageService } from '../uploadImage.service';

export const getUploadImageModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseTestModule, DatabaseCacheModule, ApiModule],
    providers: [UploadImageService],
  }).compile();

  return {
    userRepo: moduleRef.get(UsersRepositories),
    userHandler: moduleRef.get(UserHandlerContract),
    imageContract: moduleRef.get(ImageContract),
    uploadImage: moduleRef.get(UploadImageService),
  };
};
