import { DataSource } from 'typeorm';
import { AppDataSource } from './data-source';

export const databaseProvider = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (): Promise<DataSource> => {
      return AppDataSource.initialize();
    },
  },
];
