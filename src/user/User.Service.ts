import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/Prisma.Service';
import { CreateUserDto } from './dto/CreateUser.Dto';
import { UpdateUserDto } from './dto/UpdateUser.Dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role || 'user',
      },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      where: { role: 'user' },
    });
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    if (user.role === 'admin') {
      throw new ForbiddenException('Cannot delete another admin');
    }

    return this.prisma.user.delete({ where: { id } });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async setOtp(email: string, hashedOtp: string, otpExpiry: Date) {
    return this.prisma.user.update({
      where: { email },
      data: {
        otp: hashedOtp,
        otpExpiresAt: otpExpiry,
      },
    });
  }
}
