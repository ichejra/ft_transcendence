import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3030, () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}...`);
  });
}
bootstrap();
