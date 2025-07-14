import { Module } from '@nestjs/common';
import { AppService } from './App.Service';
import { AppController } from './App.Controller';
import { UserModule } from './user/User.Module';
import { AuthModule } from './auth/Auth.Module';
import { PrismaModule } from './prisma/Prisma.Module';
import { MqttModule } from './mqtt/Mqtt.Module';
import { AppConfigModule } from './config/AppConfigModule';
import { EmailModule } from './nodeMailer/Email.Module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    MqttModule,
    AppConfigModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
