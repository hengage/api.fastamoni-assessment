import { join } from 'path';
import { EnvironmentKeys } from 'src/config/config.service';
import { DataSource } from 'typeorm';
import { ENV } from '../config/env';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: ENV.DATABASE_HOST as EnvironmentKeys,
  port: +ENV.DATABASE_PORT,
  username: ENV.DATABASE_USERNAME as EnvironmentKeys,
  password: ENV.DATABASE_PASSWORD as EnvironmentKeys,
  database: ENV.DATABASE_NAME as EnvironmentKeys,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrationsRun: false,
  logging: true,
});
