import { Module } from '@nestjs/common';
import { SharedModule } from '../../common/shared.module';
import { DivisionsController } from './divisions.controller';
import { DivisionsService } from './divisions.service';

@Module({
  imports: [SharedModule],
  controllers: [DivisionsController],
  providers: [DivisionsService],
})
export class DivisionsModule {}
