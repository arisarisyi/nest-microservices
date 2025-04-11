import { Module } from '@nestjs/common';
import { ManPowerController } from './man-power.controller';
import { ManPowerService } from './man-power.service';

@Module({
  imports: [],
  controllers: [ManPowerController],
  providers: [ManPowerService],
})
export class ManPowerModule {}
