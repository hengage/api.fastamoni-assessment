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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
