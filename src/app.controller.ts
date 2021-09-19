import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Transport } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('writer.handle.data.nats', Transport.NATS)
  handleDataNATS(data: any): any {
    console.log('received "writer.handle.data.nats"');
    return this.appService.handleData(data);
  }

  @MessagePattern({ cmd: 'writer.handle.data.tcp' }, Transport.TCP)
  handleDataTCP(data: any): any {
    console.log('received "writer.handle.data.tcp"');
    return this.appService.handleData(data);
  }
}
