import { Module } from '@nestjs/common';

import { NonAuthUsersRoutesModule } from './controllers/users/notAuthenticated/nonAuthUsersRoutes.module';
import { AuthUsersRoutes } from './controllers/users/authenticated/authUsersRoutes.module';

@Module({
  imports: [NonAuthUsersRoutesModule, AuthUsersRoutes],
})
export class HttpModule {}
