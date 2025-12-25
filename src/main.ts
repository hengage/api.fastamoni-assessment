import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger.config';
import { ENV } from './config/env';
import { EnvironmentKeys } from './config/config.service';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      stopAtFirstError: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new ResponseInterceptor(app.get(Reflector)),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');

  if (ENV.NODE_ENV === 'development') {
    setupSwagger(app);
  }

  await app.listen(ENV.PORT as EnvironmentKeys);
}
bootstrap().catch((e) => console.error('Error bootstrapping app:', e));
