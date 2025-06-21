import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))

  const config = new DocumentBuilder()
    .setTitle('Users')
    .setDescription('Control users')
    .setVersion('1.0')
    .addTag('users')
    .build()
    const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();
