import { Test } from '@nestjs/testing';
import { UsersRepositories } from '@app/repositories/users';
import { ApiModule } from '@infra/api/api.module';
import { ImageContract } from '@infra/api/contracts/imageContract';
import { DatabaseCacheModule } from '@infra/storages/cache/cache.module';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { DatabaseModule } from '@infra/storages/db/database.module';
import { UploadImageService } from '../uploadImage.service';

export const getUploadImageModule = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DatabaseModule, DatabaseCacheModule, ApiModule],
    providers: [UploadImageService],
  }).compile();

  return {
    userRepo: moduleRef.get(UsersRepositories),
    userHandler: moduleRef.get(UserHandlerContract),
    imageContract: moduleRef.get(ImageContract),
    uploadImage: moduleRef.get(UploadImageService),
  };
};
