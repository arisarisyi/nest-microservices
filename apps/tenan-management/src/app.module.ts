import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenanService } from './config/database/tenan/tenan.service';
import { TenanTypeModule } from './modules/tenan-type/tenan-type.module';
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
      name: 'hrd_connection',
      useClass: TenanService,
    }),
    LoggerModule,
    TenanTypeModule,
  ],
})
export class AppModule {}
