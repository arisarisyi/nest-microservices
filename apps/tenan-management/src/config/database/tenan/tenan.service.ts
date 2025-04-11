import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as path from 'path';
import { TypeOrmWinstonLogger } from '@app/logger';

@Injectable()
export class TenanService implements TypeOrmOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly typeOrmLogger: TypeOrmWinstonLogger,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_TENAN'),
      entities: [
        path.join(__dirname, '../src/models/tenan/entities/*.entity.{ts,js}'),
      ],
      autoLoadEntities: true,
      logging: true,
      logger: this.typeOrmLogger,
    };
  }
}
