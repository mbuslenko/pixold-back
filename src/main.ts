require('dotenv').config()

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PixoldLogger } from './common/utils/logger';
import { PORT } from './config';

async function bootstrap() {
  const logger = new PixoldLogger('PIXOLD');
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  await app.listen(PORT);
}
bootstrap();
