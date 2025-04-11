import { Module } from '@nestjs/common';
import { SharedModule } from '../../common/shared.module';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';

@Module({
  imports: [SharedModule],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}
