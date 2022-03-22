import {
    Catch,
    ArgumentsHost,
} from '@nestjs/common';
import {
  BaseExceptionFilter
} from '@nestjs/core';


@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const message = (exception instanceof Error) ? exception.message : exception.error;
    let status = exception.status || 400;
    response
      .status(status)
      .json({
        status,
        success: false,
        error: (!exception.status) ? 'Resource not found' : message,
      });
  }
}
