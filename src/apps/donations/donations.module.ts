import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../../database/database.module';
import { WalletModule } from '../wallet/wallet.module';
import { DonationsRepository } from './donations.repository';
import { IdempotencyModule } from 'src/common/services/idempotency/idempotency.module';
import { EmailModule } from 'src/common/services/notifications/email/email.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    WalletModule,
    IdempotencyModule,
    EmailModule,
  ],
  controllers: [DonationsController],
  providers: [DonationsService, DonationsRepository],
})
export class DonationsModule {}
