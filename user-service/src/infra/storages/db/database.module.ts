import { Module } from '@nestjs/common';
import { UsersRepositories } from '../../../app/repositories/users';
import * as dotenv from 'dotenv';
import { InMemmoryUser } from '@root/test/inMemmoryDatabases/user';
import { PrismaUserRepository } from './prisma/repositories/user';
import { PrismaService } from './prisma/prisma.service';

dotenv.config();

@Module({
  providers:
    process.env.NODE_ENV !== 'test'
      ? [
          PrismaService,
          {
            provide: UsersRepositories,
            useClass: PrismaUserRepository,
          },
        ]
      : [
          {
            provide: UsersRepositories,
            useClass: InMemmoryUser,
          },
        ],
  exports: [UsersRepositories],
})
export class DatabaseModule {}
