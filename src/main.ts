import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aniadimos el prefijo 'api' a todas las rutas
  app.setGlobalPrefix('api/v2');

  // Pipe de validacion global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      
      // Estas 2 configuraciones de transform permiten que se haga una conversion implicita de los tipos de datos que se reciben por los query parameters (URL)
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
