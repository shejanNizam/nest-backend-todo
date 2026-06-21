import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpStatus,
  RequestMethod,
} from '@nestjs/common';
import { HTTP_CODE_METADATA, METHOD_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable, map } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

export interface ApiResponse<T> {
  statusCode: number;
  success: true;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();
    const message =
      this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? 'Request successful';
    const statusCode =
      this.reflector.getAllAndOverride<number>(HTTP_CODE_METADATA, [
        context.getHandler(),
        context.getClass(),
      ]) ??
      (this.reflector.get<RequestMethod>(
        METHOD_METADATA,
        context.getHandler(),
      ) === RequestMethod.POST
        ? HttpStatus.CREATED
        : response.statusCode);

    return next.handle().pipe(
      map((data) => ({
        statusCode,
        success: true,
        message,
        data,
      })),
    );
  }
}
