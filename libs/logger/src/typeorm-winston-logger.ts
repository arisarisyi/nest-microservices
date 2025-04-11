import { Logger as WinstonLogger } from 'winston';
import { Logger } from 'typeorm';

export class TypeOrmWinstonLogger implements Logger {
  constructor(private readonly logger: WinstonLogger) {}

  logQuery(query: string, parameters?: any[]) {
    this.logger.debug(`[Query]: ${query}`, { parameters });
  }

  logQueryError(error: string | Error, query: string, parameters?: any[]) {
    this.logger.error(`[QueryError]: ${query}`, {
      error,
      parameters,
    });
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.logger.warn(`[SlowQuery: ${time}ms]: ${query}`, { parameters });
  }

  logSchemaBuild(message: string) {
    this.logger.debug(`[SchemaBuild]: ${message}`);
  }

  logMigration(message: string) {
    this.logger.debug(`[Migration]: ${message}`);
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    this.logger.log(level, `[TypeORM]: ${message}`);
  }
}
