import { DataSource } from 'typeorm';
import { typeORMConsts } from './constants';
import config from '@root/ormconfig';

const dataSource = new DataSource({ ...config });

export const databaseProviders = [
  {
    provide: typeORMConsts.databaseProvider,
    useFactory: async () => {
      return dataSource.initialize();
    }
  }
];

export default dataSource;
