import { UsersRepositories } from '../../../app/repositories/users';
import { entitiesProviders } from './typeorm/entities/entities.provider';
import { Module } from '@nestjs/common';
import { UserService } from './typeorm/entities/user/user.service';
import { databaseProviders } from './typeorm/database.provider';
import * as dotenv from 'dotenv';
import { InMemmoryUser } from '@root/test/inMemmoryDatabases/user';

dotenv.config();

@Module({
  providers:
    process.env.NODE_ENV !== 'test'
      ? [
          ...databaseProviders,
          ...entitiesProviders,
          {
            provide: UsersRepositories,
            useClass: UserService,
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
