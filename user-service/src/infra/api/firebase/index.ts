import { Injectable } from '@nestjs/common';
import { logger } from '@src/config/logger';
import { ImageContract } from '../contracts/imageContract';
import { bucket } from './resources';

@Injectable()
export class FirebaseAPI extends ImageContract {
  async delete(url: string): Promise<void> {
    await bucket.deleteFiles({
      startOffset: url,
    });
  }

  async send(_file: Express.Multer.File): Promise<void> {
    const file = bucket.file(_file.filename);

    const stream = file.createWriteStream({
      metadata: {
        contentData: _file.mimetype,
      },
    });

    stream.on('error', (err) => {
      logger.error('An error was generated on upload image route: ', err.name);
    });

    stream.on('finish', async () => {
      file.publicUrl();
    });

    stream.end(_file.buffer);
  }
}
