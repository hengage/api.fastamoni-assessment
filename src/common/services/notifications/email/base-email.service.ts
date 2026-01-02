import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as brevo from '@getbrevo/brevo';
import { EmailParams } from './email.interface';

@Injectable()
export abstract class BaseEmailService extends brevo.TransactionalEmailsApi {
  protected readonly logger = new Logger(this.constructor.name);

  constructor() {
    super();
  }

  abstract sendEmail(params: EmailParams): Promise<void>;

  protected handleEmailError(error: any): never {
    this.logger.error('Failed to send email', error);
    throw new InternalServerErrorException('Failed to send email');
  }
}
