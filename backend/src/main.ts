import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();
async function bootstrap() {
  const logger: Logger = new Logger('AppMain');
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });
   app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000);
  logger.log(`Running on http://localhost:${process.env.PORT}`);
}
bootstrap();
