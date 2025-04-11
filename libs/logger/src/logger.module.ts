import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      level: process.env.LOG_LEVEL || 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            nestWinstonModuleUtilities.format.nestLike(
              process.env.APP_NAME || 'App',
              {
                prettyPrint: true,
              },
            ),
          ),
        }),
        new winston.transports.File({
          filename: `logs/${process.env.APP_NAME || 'app'}.log`,
          level: 'debug',
        }),
        new winston.transports.File({
          filename: `logs/${process.env.APP_NAME || 'app'}.error.log`,
          level: 'error',
        }),
      ],
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
