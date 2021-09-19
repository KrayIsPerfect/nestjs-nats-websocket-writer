import {Inject, Injectable} from '@nestjs/common';
import * as fs from 'fs';
import {DataTypeEnum} from './utils/data.type.enum';
import {IData} from './utils/data.interface';
import {ClientProxy, Transport} from "@nestjs/microservices";
import {IResponse} from "./utils/response.interface";

@Injectable()
export class AppService {
  private counterNats = 0;
  private counterTcp = 0;

  constructor(
      @Inject('NATS_MESSAGE_BUS')
      private readonly clientNats: ClientProxy,
      @Inject('TCP_MESSAGE_BUS')
      private readonly clientTcp: ClientProxy,
  ) {}

  async handleData(data: IData, transport: Transport): Promise<IResponse> {
    let res = null;
    console.log('Handling data...');
    const processData = async (exdata: IData) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(exdata);
        }, 500);
      });
    };
    const processedData = (await processData(data)) as IData;
    if (data.type === DataTypeEnum.FILE) {
      res = await this.handleDataFile(processedData);
    } else if (data.type === DataTypeEnum.DATA) {
      res = await this.handleDataObject(processedData);
    } else {
      res = { success: true, type: data.type, err: 'Unknown datatype' };
    }
    if (transport === Transport.TCP) {
      this.counterNats++
    } else if (transport === Transport.NATS) {
      this.counterTcp++
    }
    return res;
  }

  private async handleDataFile(data: IData): Promise<IResponse> {
    try {
      if (data.data) {
        console.log('Saving file...');
        if (data.part === 1) {
          fs.writeFileSync(data.name, Buffer.from(data.data.data));
        } else {
          fs.appendFileSync(data.name, Buffer.from(data.data.data));
        }
        console.log('File handled');
        return {
          name: data.name,
          type: data.type,
          part: data.part,
          success: true,
        };
      } else {
        console.log('Deleting file...');
        if (fs.existsSync(data.name)) {
          fs.unlinkSync(data.name);
        }
        console.log('File handled');
        return {
          name: data.name,
          type: data.type,
          part: data.part,
          success: true,
        };
      }
    } catch (err) {
      console.log('Error when handling file: ', err.message);
      return {
        name: data.name,
        type: data.type,
        part: data.part,
        success: false,
        err: err.message,
      };
    }
  }

  private async handleDataObject(data: IData): Promise<IResponse> {
    try {
      console.log('Handling object...');
      console.log(data);
      console.log('object handled');
      return {
        type: data.type,
        success: true,
      };
    } catch (err) {
      console.log('Error when handling data: ', err.message);
      return {
        type: data.type,
        success: false,
        err: err.message,
      };
    }
  }

  checkCounter(counter: number, transport: Transport): void {
    console.log('counter', counter, transport);
    console.log('this', this.counterTcp, this.counterNats);
    if (transport === Transport.NATS) {
      const queueNats = this.counterNats - counter;
      if (queueNats < 10) {
        this.clientNats.emit('reader.send.data.on.off.nats', true);
      } else if (queueNats > 50) {
        this.clientNats.emit('reader.send.data.on.off.nats', false);
      }
    } else if (transport === Transport.TCP) {
      const queueTcp = this.counterTcp - counter;
      if (queueTcp < 10) {
        this.clientTcp.emit({ cmd: 'reader.send.data.on.off.tcp' }, true);
      } else if (queueTcp > 50) {
        this.clientTcp.emit({ cmd: 'reader.send.data.on.off.tcp' }, false);
      }
    }
  }
}
