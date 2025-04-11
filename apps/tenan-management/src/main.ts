import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
dotenv.config();

async function bootstrap() {
  const port = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3000;

  const app = await NestFactory.create(AppModule);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  // Use global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS with default settings
  app.enableCors();
  app.use(cookieParser());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('PPA Documentation API')
    .setDescription('Manage Tenan')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  await app.listen(port, () => {
    console.log(
      '[TENAN MANAGEMENT]',
      `Server running on http://localhost:${port}`,
    );
  });
}
bootstrap().catch((err) => {
  console.error('[TENAN MANAGEMENT] Bootstrap error:', err);
});
