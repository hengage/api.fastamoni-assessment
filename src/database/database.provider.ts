import { DataSource } from 'typeorm';
import { AppDataSource } from './data-source';
import { DATA_SOURCE } from 'src/common/constants';

export const databaseProvider = [
  {
    provide: DATA_SOURCE,
    useFactory: async (): Promise<DataSource> => {
      return AppDataSource.initialize();
    },
  },
];
