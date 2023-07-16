import { Module } from '@nestjs/common';
import { UsersRepositories } from '@root/src/app/repositories/users';
import { InMemmoryUser } from '@root/test/inMemmoryDatabases/user';

@Module({
  providers: [
    {
      provide: UsersRepositories,
      useClass: InMemmoryUser,
    },
  ],
  exports: [UsersRepositories],
})
export class DatabaseTestModule {}
