import { FirebaseAPI } from '@infra/api/firebase';
import { UserHandler } from '@infra/storages/cache/redis/handlers/user/userHandler';
import { redisClient } from '@infra/storages/cache/redis/redisClient';
import { userFactory } from '@test/fatories/user';
import { InMemmoryUser } from '@test/inMemmoryDatabases/user';
import { Readable } from 'stream';
import { UploadImageService } from './uploadImage.service';

jest.spyOn(FirebaseAPI.prototype, 'send').mockImplementation();

const userHandler = new UserHandler();
const firebase = new FirebaseAPI();

function toStream(buffer: Buffer) {
  const stream = new Readable();

  stream.push(buffer);
  stream.push(null);

  return stream;
}

describe('Upload image tests', () => {
  afterEach(async () => {
    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be able to upload an image', async () => {
    const userRepo = new InMemmoryUser();

    const user = userFactory();
    await userRepo.create(user);

    const uploadImageService = new UploadImageService(
      userRepo,
      userHandler,
      firebase,
    );

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

    await uploadImageService.exec(user.id, randomMockFile);

    const existentUser = await userHandler.getUser(user.email.value);
    expect(typeof existentUser?.imageUrl).toEqual('string');
  });

  it("should throw an error: user doesn't exist", async () => {
    const userRepo = new InMemmoryUser();

    const user = userFactory();

    const uploadImageService = new UploadImageService(
      userRepo,
      userHandler,
      firebase,
    );

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

    expect(uploadImageService.exec(user.id, randomMockFile)).rejects.toThrow();
  });
});
