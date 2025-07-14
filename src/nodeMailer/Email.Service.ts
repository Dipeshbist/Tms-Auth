import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/User.Service';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  async sendOtpEmail(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const hashedOtp = await bcrypt.hash(otp, 10);
    await this.userService.setOtp(email, hashedOtp, otpExpiry);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Your OTP Code for Password Reset',
      text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #4A90E2; text-align: center;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Please use the OTP below to complete the process:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 32px; letter-spacing: 6px; padding: 10px 20px; border: 2px dashed #4A90E2; border-radius: 5px; background-color: #f9f9f9;">
              ${otp}
            </span>
          </div>
          <p>This OTP will expire in <strong>10 minutes</strong>.</p>
          <p>Thanks,<br/>The Hypnotik Team</p>
          <hr style="margin-top: 30px;" />
          <p style="font-size: 12px; color: #999;">This email was sent automatically. Please do not reply.</p>
        </div>
      `,
    });

    return { message: 'OTP has been sent to your email address' };
  }
}
