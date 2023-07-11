import { Injectable } from '@nestjs/common';
import { UserInCache } from '@src/app/entities/userInCache/userInCache';
import { ImageContract } from '@infra/api/contracts/imageContract';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { UsersRepositories } from '../../repositories/users';
import { DefaultService } from '../defaultService';

interface IErrors {
  notFound: Error;
}

@Injectable()
export class UploadImageService extends DefaultService<IErrors> {
  constructor(
    private userRepo: UsersRepositories,
    private userHandler: UserHandlerContract,
    private imageContract: ImageContract,
  ) {
    super({
      previsibleErrors: {
        notFound: new Error("This user doesn't exist"),
      },
    });
  }

  async exec(id: string, file: Express.Multer.File): Promise<string> {
    file.filename = `user:${id}/profilePicture.${
      file.mimetype.split('/')[1]
    }`.replaceAll(' ', '_');

    const oldUser = await this.userRepo.find({ id });

    if (!oldUser) throw this.previsibileErrors.notFound;

    if (oldUser?.imageUrl) {
      await this.imageContract.delete(oldUser.imageUrl);
    }

    const encodedFilename = encodeURIComponent(file.filename);
    const url = `${process.env.FIREBASE_TEMPLATE_IMAGE_LINK}/${encodedFilename}?alt=media`;

    await this.userRepo.uploadImage(id, url);

    await this.imageContract.send(file);

    const newUser = new UserInCache(oldUser);
    newUser.imageUrl = url;
    const newTTL = 1000 * 60 * 60 * 24;

    await this.userHandler.forceUpdate(oldUser, newUser, newTTL);

    return url;
  }
}
