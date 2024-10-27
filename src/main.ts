import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const _app = await NestFactory.create(AppModule);

  const _config = _app.get(ConfigService);

  _app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  _app.use(compression());

  const _apiRootPrefix = _config.get('API_ROOT_PREFIX');
  _app.setGlobalPrefix(_apiRootPrefix);

  _app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  _app.enableCors();

  const _options = new DocumentBuilder()
    .setTitle(`${_config.get('APP_NAME')} API`)
    .setDescription(_config.get('APP_DESCRIPTION'))
    .setVersion(_config.get('APP_VERSION'))
    .build();

  const _docsRootPrefix = _config.get('DOCS_ROOT_PREFIX');
  const _document = SwaggerModule.createDocument(_app, _options);
  SwaggerModule.setup(_docsRootPrefix, _app, _document, {
    explorer: true,
  });

  const _port = _config.get('PORT');
  await _app.listen(_port);

  Logger.log(`🚀 Application is running on: http://localhost:${_port}/${_apiRootPrefix}`);
}

bootstrap().catch((err) => {
  Logger.error(err);
});
