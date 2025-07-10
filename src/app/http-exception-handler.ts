import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    Sentry.captureException(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const message = exception.message || exception.getResponse();

    response.status(status).json({ message });
  }
}
