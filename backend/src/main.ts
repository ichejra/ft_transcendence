import {
  Logger,
  ValidationPipe
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ExceptionsFilter } from './exceptions/exceptions.filter';
import { ConfigService } from '@nestjs/config';

dotenv.config();
async function bootstrap() {
  const logger: Logger = new Logger('AppMain');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
  });
  app.useGlobalFilters(new ExceptionsFilter());
  app.setGlobalPrefix('api', { exclude: ['auth'] });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.get('PORT') || 3001, async () => {
    logger.log(`App listening on ${await app.getUrl()}`)
  });
}
bootstrap();
