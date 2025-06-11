import { Injectable } from '@nestjs/common';
import { EmailClient, EmailMessage } from '@azure/communication-email';
import { ConfigService } from '@nestjs/config';
import { PendingUser } from '../user/domain/entities/pending-user.entity';

@Injectable()
export class MailerService {
  private client: EmailClient;

  constructor(private readonly configService: ConfigService) {
    // const connectionString = this.configService.get<string>(
    //   'AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING'
    // );
    // this.client = new EmailClient(connectionString);
  }

  async sendPendingUsersEmails(pendingUsers: PendingUser[]): Promise<void> {
    await Promise.all(
      pendingUsers.map((pendingUser) =>
        this.sendEmail(
          pendingUser.email,
          'test',
          'Quack quack',
          `<html lang="fr">
            <body>
              <h1>Quack quack</h1>
            </body>
          </html>`
        )
      )
    );
  }

  async sendEmail(
    to: string,
    subject: string,
    plainText: string,
    htmlContent?: string
  ): Promise<void> {
    const emailMessage: EmailMessage = {
      senderAddress: this.configService.get<string>('SENDER_EMAIL_ADDRESS'),
      content: {
        subject: subject,
        plainText: plainText,
        html: htmlContent,
      },
      recipients: {
        to: [{ address: to }],
      },
    };

    try {
      const poller = await this.client.beginSend(emailMessage);
      const result = await poller.pollUntilDone();
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
