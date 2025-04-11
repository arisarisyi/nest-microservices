import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{
    statusCode: number;
    status: boolean;
    message: string;
    data: T | [];
  }> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        return {
          statusCode: response.statusCode || 200,
          status: true,
          message: 'Success',
          data,
        };
      }),
      catchError((error) => {
        const statusCode =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse =
          error instanceof HttpException ? error.getResponse() : error.message;

        // Pastikan `message` hanya string, bukan object
        const message =
          typeof errorResponse === 'object' && errorResponse !== null
            ? errorResponse['message']
            : errorResponse;

        return throwError(
          () =>
            new HttpException(
              { statusCode, status: false, message },
              statusCode,
            ),
        );
      }),
    );
  }
}
