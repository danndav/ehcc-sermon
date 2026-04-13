import {
    applyDecorators,
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
    UseInterceptors,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest();
      const methodName = context.getHandler().name;
      const className = context.getClass().name;
      const body = request.body;
      const params = request.params;
      const query = request.query;
      const response = ctx.getResponse();
  
      Logger.log(
        `Calling controller method: ${methodName}, request: ${JSON.stringify(params)}, query: ${JSON.stringify(query)}}`,
        `${className}::${methodName}`
      );
  
      return next.handle().pipe(
        tap((responseData) =>
          response.on('finish', () => {
            Logger.log(
              `Method: ${methodName}, returned status: ${response.statusCode}`,
              `${className}::${methodName}`
            );
          })
        )
      );
    }
  }
  
  export function LogMethod(): MethodDecorator {
    return applyDecorators(UseInterceptors(LoggingInterceptor));
  }
  
  export function LogController(): ClassDecorator {
    return applyDecorators(UseInterceptors(LoggingInterceptor));
  }
  