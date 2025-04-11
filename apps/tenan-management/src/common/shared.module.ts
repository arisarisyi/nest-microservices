import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenanTypeEntity } from '../models/tenan/entities/tenan-type.entities';

@Module({
  imports: [TypeOrmModule.forFeature([TenanTypeEntity], 'hrd_connection')],
  exports: [TypeOrmModule],
})
export class SharedModule {}
