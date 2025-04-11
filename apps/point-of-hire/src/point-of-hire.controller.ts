import { Controller, Get } from '@nestjs/common';
import { PointOfHireService } from './point-of-hire.service';

@Controller()
export class PointOfHireController {
  constructor(private readonly pointOfHireService: PointOfHireService) {}

  @Get()
  getHello(): string {
    return this.pointOfHireService.getHello();
  }
}
