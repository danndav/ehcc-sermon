import serverlessExpress from '@codegenie/serverless-express';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Handler } from 'aws-lambda';
import express, { json } from 'express';

import { GlobalExceptionFilter } from './aop/filters/global-exception.filter';
import { setupOpenAPI } from './aop/open-api';
import { RootModule } from './root.module';

export async function bootstrap(): Promise<Handler> {
  const expressApp = express();
  const app = await NestFactory.create(RootModule, new ExpressAdapter(expressApp), {
    abortOnError: false,
  });

  if (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'local') {
    setupOpenAPI(app);
  }

  app.enableCors();

  // Configure JSON parsing for all routes
  app.use(json({ limit: '10mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.init();

  app.setGlobalPrefix('api/v1');

  return serverlessExpress({ app: expressApp });
}
