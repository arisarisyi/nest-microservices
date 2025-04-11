import { Module } from '@nestjs/common';
import { SharedModule } from '../../common/shared.module';
import { TenanTypeController } from './tenan-type.controller';
import { TenanTypeService } from './tenan-type.service';

@Module({
  imports: [SharedModule],
  controllers: [TenanTypeController],
  providers: [TenanTypeService],
})
export class TenanTypeModule {}
