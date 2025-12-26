// users.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { usersProviders } from './users.provider';
import { UsersRepository } from './users.repository';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [DatabaseModule, WalletModule],
  controllers: [UsersController],
  providers: [...usersProviders, UsersRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
