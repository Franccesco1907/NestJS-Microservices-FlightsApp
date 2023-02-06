import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { timeout, Observable } from 'rxjs';

@Injectable()
export class TimeOutInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    nest: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return nest.handle().pipe(timeout(120000));
  }
}
