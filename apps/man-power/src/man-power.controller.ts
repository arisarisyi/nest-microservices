import { Controller, Get } from '@nestjs/common';
import { ManPowerService } from './man-power.service';

@Controller()
export class ManPowerController {
  constructor(private readonly manPowerService: ManPowerService) {}

  @Get()
  getHello(): string {
    return this.manPowerService.getHello();
  }
}
