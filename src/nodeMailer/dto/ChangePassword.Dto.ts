import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  otp: string;

  @ApiProperty()
  @IsNotEmpty()
  newPassword: string;

  // @IsNotEmpty()
  // @IsString()
  // @Length(6, 6, { message: 'OTP must be exactly 6 characters long' })
  // otp: string;
}
