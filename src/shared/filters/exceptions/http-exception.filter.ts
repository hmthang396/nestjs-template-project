import { LoggerService } from '@infrastructures/logging/logger.service';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { FormatHelper } from '@shared/helpers';
import { Response } from 'express';
import { Request } from 'express';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly i18nService: I18nService,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const httpContext = host.switchToHttp();
    const response = httpContext.getResponse<Response>();
    const request = httpContext.getRequest<Request>();

    const statusCode = this.getHttpStatus(exception);
    const formattedException = this.handleExceptionTranslation(exception);

    this.logRequestException(request, statusCode, formattedException);

    // Format error response structure
    const formattedResponse = FormatHelper.formatException(statusCode, request.url, formattedException.message);

    response.status(statusCode).json(formattedResponse);
  }

  // Extract and return the HTTP status code from the exception
  private getHttpStatus(exception: HttpException | any): number {
    return exception?.getStatus ? exception.getStatus() : HttpStatus.BAD_REQUEST;
  }

  // Translate and format the exception message using i18n
  private handleExceptionTranslation(exception: HttpException): HttpException {
    const exceptionResponse = this.extractExceptionResponse(exception);

    const currentLanguage = I18nContext.current()?.lang || 'en';

    const translatedMessage: string =
      this.i18nService.translate(exceptionResponse.message, {
        lang: currentLanguage,
        args: exceptionResponse.args || {},
      }) || 'Bad Request';

    // Modify exception message with translated message
    exception.message = translatedMessage;
    return exception;
  }

  // Extracts the response structure of the exception
  private extractExceptionResponse(exception: HttpException): any {
    return exception?.getResponse
      ? (exception.getResponse() as {
          message: string;
          error?: string;
          statusCode?: string;
          args?: any;
        })
      : { message: 'Bad Request' };
  }

  // Log the exception details (use appropriate logging level based on status)
  private logRequestException(request: Request, statusCode: number, exception: HttpException) {
    const logMessage = `End Request for ${request.path} method=${request.method} status=${statusCode}`;
    const errorMessage = `statusCode=${statusCode}, message=${exception.message}`;

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(logMessage, errorMessage, exception.stack);
    } else {
      this.logger.warn(logMessage, errorMessage);
    }
  }
}
