import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('writer.handle.data')
  handleData(data: any): any {
    console.log('received "writer.handle.data"');
    return this.appService.handleData(data);
  }
}
