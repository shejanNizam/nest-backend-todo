import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponseBody {
  message?: string | string[];
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const message = this.getMessage(exceptionResponse);

    response.status(status).json({
      statusCode: status,
      success: false,
      message,
      data: null,
    });
  }

  private getMessage(exceptionResponse: string | object | undefined): string {
    if (typeof exceptionResponse === 'string') return exceptionResponse;

    if (exceptionResponse && typeof exceptionResponse === 'object') {
      const { message } = exceptionResponse as ErrorResponseBody;
      if (Array.isArray(message)) return message.join(', ');
      if (message) return message;
    }

    return 'Internal server error';
  }
}
