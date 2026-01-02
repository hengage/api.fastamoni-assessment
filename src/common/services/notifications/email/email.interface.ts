export interface EmailParams {
  templatePath: string;
  templateData: object;
  subject: string;
  recipientEmail: string;
  recipientName?: string;
}
