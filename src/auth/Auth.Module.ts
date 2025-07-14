import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/User.Module';
import { AuthController } from './Auth.Controller';
import { AuthService } from './Auth.Service';
import { JwtStrategy } from './Auth.Strategy';
import { AppConfigModule } from 'src/config/AppConfigModule';
// import { GoogleStrategy } from './Google.Strategy';

@Module({
  imports: [UserModule, ConfigModule, AppConfigModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
