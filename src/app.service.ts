import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { DataTypeEnum } from './utils/data.type.enum';
import { IData } from './utils/data.interface';

@Injectable()
export class AppService {
  async handleData(data: IData): Promise<any> {
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
      return await this.handleDataFile(processedData);
    } else if (data.type === DataTypeEnum.DATA) {
      return await this.handleDataObject(processedData);
    } else {
      return { success: true, type: data.type, err: 'Unknown datatype' };
    }
  }

  private async handleDataFile(data: IData) {
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

  private async handleDataObject(data: IData) {
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
}
