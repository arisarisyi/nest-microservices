import { Module } from '@nestjs/common';
import { SharedModule } from '../../common/shared.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [SharedModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
