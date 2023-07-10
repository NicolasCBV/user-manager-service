import { Module } from '@nestjs/common';
import { UsersRepositories } from '../../../app/repositories/users';
import { entitiesProviders } from './typeorm/entities/entities.provider';
import { UserService } from './typeorm/entities/user/user.service';
import { databaseProviders } from './typeorm/database.provider';

@Module({
  providers: [
    /* switch for this to use prisma, dont forget to import this contents:
     * PrismaService,
     * {
     *   provide: UsersRepositories,
     *   useClass: PrismaUserRepository,
     * },
     */
    ...databaseProviders,
    ...entitiesProviders,
    {
      provide: UsersRepositories,
      useClass: UserService,
    },
  ],
  exports: [UsersRepositories],
})
export class DatabaseModule {}
