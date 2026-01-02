import { Module } from '@nestjs/common';
import { EmailService } from './email.notification';

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
