import { Global, Module } from '@nestjs/common';
import { MqttService } from './Mqtt.Service';

@Global()
@Module({
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
