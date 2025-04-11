import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  dotenv.config();

  const { APP_PORT: port } = process.env;
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  // Use global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw an error if a non-whitelisted property is included
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );
  // Enable CORS with default settings
  app.enableCors();
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('PPA Documentation API')
    .setDescription('Manage Employee Position')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  await app.listen(port, () => {
    console.log('[EMPLOYEE MANAGEMENT]', `localhost:${port}`);
  });
}
bootstrap();
