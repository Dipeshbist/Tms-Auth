import { registerAs } from '@nestjs/config';

export const MailerConfig = registerAs('mailer', () => ({
  transport: {
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  },
  defaults: {
    from: `"Hypnotik Support" <${process.env.GMAIL_USER}>`,
  },
}));
