import { Injectable, NestInterceptor, ExecutionContext, CallHandler, SetMetadata } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Request } from 'express';

export const CACHE_KEY = 'cache_key';
export const CACHE_TTL = 'cache_ttl';

export const Cacheable = (ttl: number = 300000) => SetMetadata(CACHE_TTL, ttl);
export const CacheKey = (key: string) => SetMetadata(CACHE_KEY, key);

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const handler = context.getHandler();
    
    // Get cache metadata
    const ttl = Reflect.getMetadata(CACHE_TTL, handler) ?? 300000;
    const customKey = Reflect.getMetadata(CACHE_KEY, handler);
    
    const cacheKey = customKey ?? this.generateCacheKey(request);

    // Skip caching for non-GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    // Try to get from cache
    const cachedResponse = await this.cacheManager.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    // If not in cache, get fresh data and cache it
    return next.handle().pipe(
      tap(async (data) => {
        await this.cacheManager.set(cacheKey, data, ttl);
      })
    );
  }

  private generateCacheKey(request: Request): string {
    const { url, method, query, params, body } = request;
    return `${method}:${url}:${JSON.stringify(query)}:${JSON.stringify(params)}:${JSON.stringify(body)}`;
  }
} 