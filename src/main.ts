import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: '*',
    origin: true
  });

  const config = app.get<ConfigService>(ConfigService);
  console.log(config.get('port'));
  
  await app.listen(config.get<number>('port'));
}
bootstrap();
