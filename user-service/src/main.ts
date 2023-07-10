import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: process.env.CLIENT_URL as string,
    methods: ['DELETE', 'POST', 'PATCH'],
    preflightContinue: false,
    credentials: true,
  });
  app.use(cookieParser(process.env.COOKIE_SECRET));

  const server = await app.listen(process.env.PORT ?? 3030);
  server.setTimeout(1000 * 60);
}
bootstrap();
