import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtConfig } from './JwtConfig';
import { PrismaConfig } from './PrismaConfig';
import {
  JwtConfig as JwtConfigType,
  MailerConfig as MailerConfigType,
} from './ConfigTypes';
import { MailerConfig } from './MailerConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: [JwtConfig, PrismaConfig, MailerConfig],
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const jwtConfig = configService.get<JwtConfigType>('jwt');

        if (!jwtConfig) {
          throw new Error('JWT config is not defined');
        }

        return {
          secret: jwtConfig.secret,
          signOptions: jwtConfig.signOptions,
        };
      },
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MailerConfigType => {
        const mailerConfig = configService.get<MailerConfigType>('mailer');

        if (!mailerConfig) {
          throw new Error('Mailer config is not defined');
        }

        return mailerConfig;
      },
    }),
  ],
  exports: [JwtModule],
})
export class AppConfigModule {}
