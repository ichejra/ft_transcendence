import {
  Logger,
  ValidationPipe
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ExceptionsFilter } from './exceptions/exceptions.filter';

dotenv.config();
async function bootstrap() {
  const logger: Logger = new Logger('AppMain');
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
  });
  app.useGlobalFilters(new ExceptionsFilter());
  app.setGlobalPrefix('api', { exclude: ['auth'] });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000, async () => {
    logger.log(`App listening on ${await app.getUrl()}`)
  });
}
bootstrap();
