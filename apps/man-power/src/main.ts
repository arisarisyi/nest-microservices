import { NestFactory } from '@nestjs/core';
import { ManPowerModule } from './man-power.module';

async function bootstrap() {
  const app = await NestFactory.create(ManPowerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
