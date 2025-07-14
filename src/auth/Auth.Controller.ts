import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './Auth.Service';
import { LoginDto } from './dto/Login.Dto';
import { RegisterDto } from './dto/Register.Dto';
import { RefreshTokenDto } from './dto/RefreshToken.Dto';
import { JwtAuthGuard } from './guards/Auth.Guard';
import { JwtPayload } from './types/JwtPayload';
import { GetUser } from './decorators/GetUser.Decorator';
// import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@GetUser() user: JwtPayload) {
    return this.authService.logout(user.userId);
  }

  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // googleAuth() {}

  // @Get('google/redirect')
  // @UseGuards(AuthGuard('google'))
  // async googleRedirect(@Req() req: any) {
  //   const tokens = await this.authService.loginOAuthUser(req.user);
  //   return { accessToken: tokens.accessToken };
  // }
}
