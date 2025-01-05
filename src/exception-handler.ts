import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ExceptionHandler implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.response) {
      response
        .status(exception.response.statusCode)
        .json({ message: exception.response.message });
    } else {
      response.status(500).json({ message: 'Something went wrong' });
    }
  }
}
