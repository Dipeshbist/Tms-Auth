import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  password?: string;
}
