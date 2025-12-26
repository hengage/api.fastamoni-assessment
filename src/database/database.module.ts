import { Module } from '@nestjs/common';
import { databaseProvider } from './database.provider';
import { AtomicTransactionService } from './atomic-transaction.service';

@Module({
  providers: [...databaseProvider, AtomicTransactionService],
  exports: [...databaseProvider, AtomicTransactionService],
})
export class DatabaseModule {}
