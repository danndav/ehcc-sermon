import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { SentryExceptionCaptured } from '@sentry/nestjs';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  @SentryExceptionCaptured()
  catch(exception: unknown, host: ArgumentsHost): void {
    const EXCEPTION_LOG_LENGTH = 2000;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log(exception);

    const errorDetails = this.getErrorDetails(exception);

    request?.context?.logger.error(`Error from global exception filter ${request.context.currentUser?.id || 'anonymous'}`, {
      ...errorDetails,
      exception: (exception as string).toString().substring(0, EXCEPTION_LOG_LENGTH),
      path: request.url,
      stack: exception instanceof Error ? exception.stack : 'No stack trace available',
      timestamp: new Date().toISOString(),
    });

    response.status(errorDetails.status).json({
      ...errorDetails,
      path: request.url,
      statusCode: errorDetails.status,
      timestamp: new Date().toISOString(),
    });
  }

  private getErrorDetails(exception: unknown): { code: string; message: string; status: number } {
    const errorResponse = (exception as any)?.response || {};
    const status = (exception as any)?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    // Only show the real message for known HTTP exceptions
    const isHttpException = typeof status === 'number' && status !== HttpStatus.INTERNAL_SERVER_ERROR;
    const message = isHttpException
      ? errorResponse.message || (exception as Error)?.message || 'Internal server error'
      : 'An unexpected error occurred. Please try again later.';
  
    return {
      code: this.getErrorCode(status),
      message,
      status,
    };
  }

  private getErrorCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}
