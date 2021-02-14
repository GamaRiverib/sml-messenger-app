import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthData } from './local-storage.service';
import { LOGIN_PAGE_PATH } from '../app.values';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private data: DataService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authData: AuthData = this.data.getAuthData();
    if (!authData || !authData.access_token) {
      return next.handle(req);
    }
    const headers = { Authorization: `Bearer ${authData.access_token}` };
    if (req.responseType === 'json') {
      headers['Content-Type'] = 'application/json';
    }
    const request = req.clone({ setHeaders: headers });
    return next.handle(request).pipe(catchError((response: HttpErrorResponse) => {
      if (response.status === 401) {
        this.router.navigate([ LOGIN_PAGE_PATH ]);
      }
      return throwError(response);
    }));
  }
}
