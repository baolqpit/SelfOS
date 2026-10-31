import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface ApiResponse<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T> | T>
{
  intercept(
    _: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T> | T> {
    return next.handle().pipe(
      map((data) => {
        // Keep raw response if controller already wrapped it
        if (data && typeof data === 'object' && 'data' in (data as object)) {
          return data;
        }
        return { data };
      }),
    );
  }
}
