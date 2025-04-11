import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { OrganizationStructureService } from './config/database/organization_structure/organization_structure.service';
import { DivisionsModule } from './modules/divisions/divisions.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { PositionsModule } from './modules/positions/positions.module';
import { RolesModule } from './modules/roles/roles.module';
import * as path from 'path';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { LoggerModule } from '@app/logger';

@Module({
  imports: [
    PrometheusModule.register(),
    ConfigModule.forRoot({
      envFilePath: path.resolve(
        process.cwd(),
        `.env.${process.env.NODE_ENV || 'development'}`,
      ),
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      name: 'os_connection',
      useClass: OrganizationStructureService,
    }),
    LoggerModule,
    DivisionsModule,
    DepartmentsModule,
    PositionsModule,
    RolesModule,
    HttpModule,
  ],
})
export class AppModule {}
