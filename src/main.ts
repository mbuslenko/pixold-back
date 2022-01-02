require('dotenv').config()

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module';
import { PixoldLogger } from './common/utils/logger';
import { PORT } from './config';

async function bootstrap() {
  const logger = new PixoldLogger('PIXOLD');
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      allowedHeaders: [
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Allow-Origin',
        'Accept',
        'Cache-Control',
        'Content-Type',
        'Access-Control-Allow-Credentials',
        'Authorization',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    },
    logger,
  });
  initSwagger(app);

  await app.listen(PORT);
}

const initSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('Pixold API')
    .setDescription('Pixold API Documentation')
    .setVersion(`${process.env.npm_package_version}`)
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('swagger', app, document)
}

bootstrap();
