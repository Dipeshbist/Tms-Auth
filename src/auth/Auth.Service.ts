import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/Register.Dto';
import { LoginDto } from './dto/Login.Dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/Prisma.Service';
import { JwtPayload } from './types/JwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  //  Helper to generate access & refresh tokens
  private generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    return { accessToken, refreshToken };
  }

  // Register method
  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: 'user',
      },
    });

    return {
      message: 'Registration successful',
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  // Login method
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const { accessToken, refreshToken } = this.generateTokens(payload);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  // Refresh token method
  async refreshToken(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      this.generateTokens(newPayload);

    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedNewRefreshToken },
    });

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
    };
  }

  // async validateOAuthLogin(profile: any) {
  //   const email = profile.emails?.[0].value;
  //   let user = await this.prisma.user.findUnique({ where: { email } });
  //   if (!user) {
  //     user = await this.prisma.user.create({
  //       data: { email, password: '', role: 'user' },
  //     });
  //   }
  //   return user;
  // }

  // async loginOAuthUser(user: any) {
  //   const payload = { userId: user.id, email: user.email, role: user.role };
  //   return {
  //     accessToken: this.jwtService.sign(payload, { expiresIn: '1h' }),
  //     refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
  //   };
  // }

  //  Logout to clear refresh token
  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { message: 'Logged out successfully' };
  }
}
