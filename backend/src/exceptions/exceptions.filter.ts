import {
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import {
  BaseExceptionFilter
} from '@nestjs/core';


@Catch(HttpException)
export class ExceptionsFilter extends BaseExceptionFilter {

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const message = (exception instanceof Error) ? exception.message : exception.error;
    let status: any = exception.status ?? 404;
    response
      .status(status)
      .json({
        status,
        success: false,
        error: (!exception.status) ? 'Not Found' : message,
      });
  }
}
