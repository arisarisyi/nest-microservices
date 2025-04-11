import { Injectable } from '@nestjs/common';

@Injectable()
export class PointOfHireService {
  getHello(): string {
    return 'Hello World!';
  }
}
