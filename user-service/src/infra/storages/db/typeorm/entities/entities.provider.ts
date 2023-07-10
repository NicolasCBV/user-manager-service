import { DataSource } from 'typeorm';
import { typeORMConsts } from '../constants';
import { TypeORMUser } from './user/users.entity';

export const entitiesProviders = [
  {
    provide: typeORMConsts.userProvider,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(TypeORMUser),
    inject: [typeORMConsts.databaseProvider],
  },
];
