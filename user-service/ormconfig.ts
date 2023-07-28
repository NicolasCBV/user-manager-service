import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import * as dotenv from 'dotenv';
import { TypeORMUser } from '@infra/storages/db/typeorm/entities/user/users.entity';

dotenv.config();

const config: MysqlConnectionOptions = {
  type: 'mysql',
  url: process.env.DATABASE_URL,
  entities: [TypeORMUser],
  synchronize: false,
  migrations: ['dist/src/infra/storages/db/typeorm/migrations/*.js'],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: process.env.NODE_ENV === 'development' ? true : false
}

export default config;

