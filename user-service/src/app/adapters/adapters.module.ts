import { Module } from '@nestjs/common';
import { BcryptAdapter } from './bcrypt/bcryptAdapter';
import { CryptAdapter } from './crypt';
import { EmailAdapter } from './email';
import { NodemailerAdapter } from './nodemailer/nodemailerAdapter';

@Module({
  providers: [
    {
      provide: CryptAdapter,
      useClass: BcryptAdapter,
    },
    {
      provide: EmailAdapter,
      useClass: NodemailerAdapter,
    },
  ],
  exports: [CryptAdapter, EmailAdapter],
})
export class AdaptersModule {}
