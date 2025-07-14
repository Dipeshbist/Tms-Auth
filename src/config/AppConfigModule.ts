import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtConfig } from './JwtConfig';
import { PrismaConfig } from './PrismaConfig';
import { MailerConfig } from './MailerConfig';
import { JwtConfigOptions } from './ConfigTypes';
import { MailerConfigOptions } from './ConfigTypes';

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
        const jwtConfig = configService.get<JwtConfigOptions>('jwt');
        if (!jwtConfig) throw new Error('JWT config missing');
        return {
          secret: jwtConfig.secret,
          signOptions: jwtConfig.signOptions,
        };
      },
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MailerConfigOptions => {
        const mailerConfig = configService.get<MailerConfigOptions>('mailer');
        if (!mailerConfig) throw new Error('Mailer config missing');
        return mailerConfig;
      },
    }),
  ],
  exports: [JwtModule, MailerModule],
})
export class AppConfigModule {}
