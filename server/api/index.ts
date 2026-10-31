import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express, { type Express } from 'express';
import helmet from 'helmet';
import type { IncomingMessage, ServerResponse } from 'http';

import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

let cached: Express | null = null;

async function bootstrap(): Promise<Express> {
  if (cached) return cached;

  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    logger: ['error', 'warn', 'log'],
  });

  app.setGlobalPrefix('api/v1');
  app.use(helmet());
  app.enableCors({
    origin: [process.env.WEB_ORIGIN ?? 'http://localhost:3000', /\.vercel\.app$/],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  if (process.env.SWAGGER_ENABLED !== 'false') {
    const swagger = new DocumentBuilder()
      .setTitle('selfOS API')
      .setDescription('Personal portfolio multi-tenant API')
      .setVersion('0.1.0')
      .addBearerAuth()
      .build();
    const doc = SwaggerModule.createDocument(app, swagger);
    SwaggerModule.setup('docs', app, doc, {
      customCssUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-standalone-preset.min.js',
      ],
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.init();
  cached = expressApp;
  return expressApp;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await bootstrap();
  app(req as express.Request, res as express.Response);
}
