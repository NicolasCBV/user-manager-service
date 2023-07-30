import { typeORMConsts } from './constants';
import config from '@root/ormconfig';
import { TypeORMService } from './typeORM.service';

const dataSource = new TypeORMService({ ...config });
export const databaseProviders = [
  {
    provide: typeORMConsts.databaseProvider,
    useFactory: async () => {
      return dataSource.initialize();
    },
  },
];

export { dataSource };
