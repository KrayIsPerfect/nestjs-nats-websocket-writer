import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class AppService {
  async handleData(data: any): Promise<any> {
    if (data.type === 'file') {
      try {
        if (data.dataChunk) {
          console.log('Saving file...');
          if (data.part === 1) {
            fs.writeFileSync(data.name, Buffer.from(data.dataChunk.data));
          } else {
            fs.appendFileSync(data.name, Buffer.from(data.dataChunk.data));
          }
          console.log('Data handled');
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
          console.log('Data handled');
          return {
            name: data.name,
            type: data.type,
            part: data.part,
            success: true,
          };
        }
      } catch (err) {
        console.log('Error when handling data: ', err.message);
        return {
          name: data.name,
          type: data.type,
          part: data.part,
          success: false,
          err: err.message,
        };
      }
    }

    console.log('Data handled');
    return { success: true, type: data.type };
  }

  async processData(data: any): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 500);
    });
  }
}
