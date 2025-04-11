import { Injectable } from '@nestjs/common';

@Injectable()
export class ManPowerService {
  getHello(): string {
    return 'Hello World!';
  }
}
