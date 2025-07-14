import { Module } from '@nestjs/common';
import { UserModule } from '../user/User.Module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailController } from './Email.Controller';
import { EmailService } from './Email.Service';
import { AppConfigModule } from '../config/AppConfigModule';

@Module({
  imports: [UserModule, AppConfigModule, MailerModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
