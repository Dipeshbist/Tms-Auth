import { Injectable, OnModuleInit } from '@nestjs/common';
import mqtt from 'mqtt';
import { PrismaService } from '../prisma/Prisma.Service';

@Injectable()
export class MqttService implements OnModuleInit {
  private client: mqtt.MqttClient;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    // this.client = mqtt.connect('mqtts://<your-iot-endpoint>', {
    //   username: '<your-username>',
    //   password: '<your-password>',
    // });
    this.client = mqtt.connect('mqtt://localhost:1883');

    this.client.on('connect', () => {
      console.log(' Connected to AWS IoT MQTT broker');
      this.client.subscribe('pos/+/heartbeat');
      this.client.subscribe('pos/+/response');
      // Subscribe to admin commands
      this.client.subscribe('server/+/command');
    });

    this.client.on('message', (topic, message) => {
      void (async () => {
        const parts = topic.split('/');
        const posId = parts[1];

        try {
          const device = await this.prisma.device.findUnique({
            where: { posId },
          });
          if (!device) {
            await this.prisma.device.create({
              data: {
                name: `Auto-${posId}`,
                posId,
                status: 'online',
                lastSeenAt: new Date(),
              },
            });
            console.log(`Device ${posId} auto-registered`);
            return;
          }

          const payload = message.toString();

          if (topic.endsWith('/heartbeat')) {
            await this.handleHeartbeat(device.id, payload);
          } else if (topic.endsWith('/response')) {
            await this.handleResponse(device.id, topic, payload);
          } else if (topic.endsWith('/command')) {
            try {
              const commandPayload = JSON.parse(payload) as Record<
                string,
                unknown
              >;

              const deviceTopic = `pos/${posId}/commands`;
              this.publish(deviceTopic, commandPayload);
              console.log(`Command relayed to device topic ${deviceTopic}`);
            } catch (e) {
              console.error('Invalid command payload', e);
            }
          }
        } catch (error) {
          console.error('MQTT message handling error:', error);
        }
      })();
    });
  }

  private async handleHeartbeat(deviceId: string, payload: string) {
    await this.prisma.device.update({
      where: { id: deviceId },
      data: {
        status: 'online',
        lastSeenAt: new Date(),
      },
    });

    await this.prisma.log.create({
      data: {
        deviceId,
        message: payload,
        topic: 'heartbeat',
      },
    });

    console.log(`Heartbeat updated for device ${deviceId}`);
  }

  private async handleResponse(
    deviceId: string,
    topic: string,
    payload: string,
  ) {
    await this.prisma.log.create({
      data: {
        deviceId,
        message: payload,
        topic,
      },
    });

    console.log(`Response log saved for device ${deviceId}`);
  }

  publish(topic: string, payload: any) {
    this.client.publish(topic, JSON.stringify(payload));
  }
}
