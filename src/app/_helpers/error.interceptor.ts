import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertService } from '@app/_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  
    constructor(private alertService: AlertService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const authReq = request.clone({
            headers: request.headers
            .set('Content-Type', 'application/json')
            .set('Access-Control-Allow-Origin', '*')
          });

        return next.handle(request).pipe(catchError(err => {
            const error = err.error?.message || err.statusText;
            this.alertService.error(error);
            console.error(err);
            return throwError(error);
        }))
    }
}