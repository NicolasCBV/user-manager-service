import { typeORMConsts } from '../constants';
import { TypeORMService } from '../typeORM.service';
import { TypeORMUser } from './user/users.entity';

export const entitiesProviders = [
  {
    provide: typeORMConsts.userProvider,
    useFactory: (dataSource: TypeORMService) =>
      dataSource.getRepository(TypeORMUser),
    inject: [typeORMConsts.databaseProvider],
  },
];
