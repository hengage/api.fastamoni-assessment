import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { IdempotencyGuard } from './idempotency.guard';
import { IdempotencyRepository } from './idempotency.repository';
import { IdempotencyService } from './idempotency.service';

@Module({
  imports: [DatabaseModule],
  providers: [IdempotencyRepository, IdempotencyService, IdempotencyGuard],
  exports: [IdempotencyService, IdempotencyGuard],
})
export class IdempotencyModule {}
