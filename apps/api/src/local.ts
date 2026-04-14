import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import { GlobalExceptionFilter } from './aop/filters/global-exception.filter';
import { setupOpenAPI } from './aop/open-api';
import { RootModule } from './root.module';

async function bootstrap() {
  const app = await NestFactory.create(RootModule, { abortOnError: false });

  app.enableCors();
  app.use(json({ limit: '10mb' }));
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  setupOpenAPI(app);

  const port = process.env.PORT || 3005;
  await app.listen(port);
  console.log(`EHCC Plus API running on http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/docs`);
}

bootstrap();
