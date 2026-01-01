import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './apps/users/users.module';
import { AuthModule } from './apps/auth/auth.module';
import { WalletModule } from './apps/wallet/wallet.module';
import { DonationsModule } from './apps/donations/donations.module';
import { IdempotencyModule } from './common/services/idempotency/idempotency.module';
import { throttlerGuard } from './common/guards/throttler.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { EmailModule } from './common/services/notifications/email/email.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    AuthModule,
    WalletModule,
    DonationsModule,
    IdempotencyModule,
    EmailModule,
    throttlerGuard,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
