import { UserInCache } from '@root/src/app/entities/userInCache/userInCache';
import { userFactory } from '@root/test/fatories/user';
import { Readable } from 'stream';
import { getUploadImageModule } from './getModule';

function toStream(buffer: Buffer) {
  const stream = new Readable();

  stream.push(buffer);
  stream.push(null);

  return stream;
}

export const createDefaultSituationOnUploadImage = async () => {
  const { uploadImage, ...dependencies } = await getUploadImageModule();

  const user = userFactory();
  await dependencies.userRepo.create(user);
  await dependencies.userHandler.sendUser(new UserInCache(user), 1000);

  const blob = new Blob([''], { type: 'text/html' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  const randomMockFile: Express.Multer.File = {
    buffer,
    filename: 'filename',
    originalname: 'originalname',
    mimetype: 'text/html',
    size: buffer.byteLength,
    path: '/path/to/file',
    stream: toStream(buffer),
    destination: 'destination/of/file',
    fieldname: 'fildname',
    encoding: 'BYNARY',
  };

  const exec = () =>
    uploadImage.exec({
      id: user.id,
      file: randomMockFile,
    });

  return { exec, dependencies, user };
};
