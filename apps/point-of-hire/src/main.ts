import { NestFactory } from '@nestjs/core';
import { PointOfHireModule } from './point-of-hire.module';

async function bootstrap() {
  const app = await NestFactory.create(PointOfHireModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
