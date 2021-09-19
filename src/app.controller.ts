import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Transport } from '@nestjs/microservices';
import {IResponse} from "./utils/response.interface";
import {IData} from "./utils/data.interface";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('writer.handle.data.nats', Transport.NATS)
  async handleDataNats(data: IData): Promise<IResponse> {
    console.log('received "writer.handle.data.nats"');
    return await this.appService.handleData(data, Transport.NATS);
  }

  @MessagePattern({cmd: 'writer.handle.data.tcp'}, Transport.TCP)
  async handleDataTcp(data: IData): Promise<IResponse> {
    console.log('received "writer.handle.data.tcp"');
    return await this.appService.handleData(data, Transport.TCP);
  }

  @MessagePattern('writer.check.counter.nats', Transport.NATS)
  checkCounterNats(counter: number): void {
    console.log('received "writer.check.counter.nats"');
    this.appService.checkCounter(counter, Transport.NATS);
  }

  @MessagePattern({cmd: 'writer.check.counter.tcp' }, Transport.TCP)
  checkCounterTcp(counter: number): void {
    console.log('received "writer.check.counter.tcp"');
    this.appService.checkCounter(counter, Transport.TCP);
  }
}
