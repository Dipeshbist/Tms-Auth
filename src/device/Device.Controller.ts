import { Controller, Get, Body } from '@nestjs/common';
import { DeviceService } from './Device.Service';

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  getAll() {
    return this.deviceService.getAllDevices();
  }

  //   @Post(':id/command')
  //   sendCommand(@Param('id') id: string, @Body() body: { command: string }) {
  //     return this.deviceService.sendCommandToDevice(id, body.command);
  //   }
}
