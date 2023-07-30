import { Module } from '@nestjs/common';
import { BcryptAdapter } from './bcrypt/bcryptAdapter';
import { CookieAdapter } from './cookie';
import { CookieParserAdapter } from './cookie-parser/cookieParserAdapter';
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
    {
      provide: CookieAdapter,
      useClass: CookieParserAdapter,
    },
  ],
  exports: [CryptAdapter, CookieAdapter, EmailAdapter],
})
export class AdaptersModule {}
