import { Module } from '@nestjs/common';
import { PointOfHireController } from './point-of-hire.controller';
import { PointOfHireService } from './point-of-hire.service';

@Module({
  imports: [],
  controllers: [PointOfHireController],
  providers: [PointOfHireService],
})
export class PointOfHireModule {}
