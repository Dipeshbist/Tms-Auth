import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/Prisma.Service';

@Injectable()
export class DeviceService {
  constructor(private prisma: PrismaService) {}

  async getAllDevices() {
    return this.prisma.device.findMany({ include: { logs: true } });
  }

  //   async sendCommandToDevice(id: string, command: string) {
  //     const device = await this.prisma.device.findUnique({ where: { id } });
  //     if (!device) throw new Error('Device not found');

  //     const topic = `pos/${device.posId}/commands`;
  //     this.mqttService.publish(topic, { command });

  //     return { message: `Command '${command}' sent to ${device.name}` };
  //   }
}
