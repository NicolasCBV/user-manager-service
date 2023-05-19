import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersRepositories } from '../../../app/repositories/users';
import { PrismaUserRepository } from './prisma/repositories/user';

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepositories,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UsersRepositories],
})
export class DatabaseModule {}
