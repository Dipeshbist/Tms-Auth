import { Controller, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { ChangePasswordDto } from './dto/ChangePassword.Dto';
import { ForgotPasswordDto } from './dto/ForgotPassword.Dto';
import { EmailService } from './Email.Service';

@Controller('auth')
@ApiBearerAuth('access-token')
@ApiTags('Email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-otp')
  async sendOtp(@Body() dto: ForgotPasswordDto) {
    return this.emailService.sendOtpEmail(dto.email);
  }

  // @Post('change-password')
  // async changePassword(@Body() dto: ChangePasswordDto) {
  //   return this.emailService.changePassword(
  //     dto.email,
  //     dto.otp,
  //     dto.newPassword,
  //   );
  // }
}
