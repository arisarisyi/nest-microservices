import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DepartmentEntity,
  DivisionEntity,
  PositionEntity,
  RoleEntity,
} from '../models/organization_structure/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [DivisionEntity, DepartmentEntity, PositionEntity, RoleEntity],
      'os_connection',
    ),
    HttpModule,
  ],
  exports: [HttpModule, TypeOrmModule],
})
export class SharedModule {}
