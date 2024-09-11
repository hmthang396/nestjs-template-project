import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APP_ROUTE_PREFIX, APP_VERSION, BODY_SIZE_LIMIT } from '@shared/common/constants';
import { ArgumentsHost, Logger, VersioningType } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import * as compression from 'compression';
import { SwaggerConfig } from 'src/infrastructures/config/swagger/swagger.config';
import { HttpExceptionFilter } from '@shared/filters/exceptions/http-exception.filter';
import { HttpResponseInterceptor } from '@shared/interceptors/response';
import * as cookieParser from 'cookie-parser';
import { I18nValidationException, I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { FormatHelper } from '@shared/helpers';
import { error } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app
    .setGlobalPrefix(AppModule.apiPrefix || APP_ROUTE_PREFIX)
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: AppModule.apiVersion || APP_VERSION,
    })
    .enableCors({
      origin: ['*'],
      credentials: true,
    });

  app
    .use(helmet())
    .use(compression())
    .use(cookieParser())
    .use(bodyParser.json({ limit: BODY_SIZE_LIMIT }))
    .use(bodyParser.urlencoded({ limit: BODY_SIZE_LIMIT, extended: true }))
    .useGlobalInterceptors(new HttpResponseInterceptor(AppModule.mode))
    .useGlobalPipes(
      new I18nValidationPipe({
        stopAtFirstError: false,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    .useGlobalFilters(
      new HttpExceptionFilter(AppModule.logger, AppModule.i18n),
      new I18nValidationExceptionFilter({
        errorFormatter: (errors) => {
          return FormatHelper.exceptionFactory(errors, AppModule.i18n);
        },
        responseBodyFormatter: (host: ArgumentsHost, exc: I18nValidationException, formattedErrors: object) =>
          FormatHelper.formatException(exc.getStatus(), host.switchToHttp().getRequest<Request>().url, formattedErrors),
      }),
    );

  SwaggerConfig(app, AppModule.apiPrefix || APP_ROUTE_PREFIX);
  // Setting port for application
  await app.listen(AppModule.port, '0.0.0.0');
  return AppModule.port;
}
bootstrap().then((port: number) => {
  Logger.log(`Application running on port: ${port}`, 'Main');
});
