import * as brevo from '@getbrevo/brevo';
import { Injectable } from '@nestjs/common';
import * as ejs from 'ejs';
import { ENV } from 'src/config/env';
import { EmailParams } from './email.interface';
import { EnvironmentKeys } from 'src/config/config.service';
import { BaseEmailService } from './base-email.service';

const EMAIL_PROVIDERS = {
  BREVO: 'brevo',
} as const;

type EmailProviders = (typeof EMAIL_PROVIDERS)[keyof typeof EMAIL_PROVIDERS];
type EmailHandler = (args: EmailParams) => Promise<void>;

@Injectable()
export class EmailService extends BaseEmailService {
  async sendEmail(params: EmailParams) {
    try {
      const handler =
        this.EmailHandlersStrategy[ENV.EMAIL_PROVIDER as EmailProviders];
      return await handler(params);
    } catch (error) {
      this.handleEmailError(error);
    }
  }

  private async brevoEmailProvider(data: EmailParams) {
    const {
      templatePath,
      templateData,
      subject,
      recipientEmail,
      recipientName,
    } = data;
    this.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      ENV.BREVO_API_KEY as EnvironmentKeys,
    );

    const htmlContent = await ejs.renderFile(templatePath, templateData);

    const email = new brevo.SendSmtpEmail();
    email.subject = subject;
    email.htmlContent = htmlContent;
    email.sender = {
      name: ENV.EMAIL_SENDER_NAME as EnvironmentKeys,
      email: ENV.EMAIL_SENDER_EMAIL as EnvironmentKeys,
    };
    email.to = [{ email: recipientEmail, name: recipientName }];

    return await this.sendTransacEmail(email);
  }

  private readonly EmailHandlersStrategy: Record<
    EmailProviders,
    (args: EmailParams) => Promise<void>
  > = {
    [EMAIL_PROVIDERS.BREVO]: this.brevoEmailProvider.bind(this) as EmailHandler,
  };
}
