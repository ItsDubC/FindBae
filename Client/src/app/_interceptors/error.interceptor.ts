import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router, 
    private toastr: ToastrService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error) {
          switch (error.status) {
            case 500: {
              const statusText = error.statusText == "OK" ? "Internal Server Error" : error.statusText;
              this.toastr.error(statusText, error.status);
              const navigationExtras: NavigationExtras = { state: { error: error.error } };
              this.router.navigateByUrl("/server-error", navigationExtras);
              break;
            }
            case 401: {
              const statusText = error.statusText == "OK" ? "Unauthorized" : error.statusText;
              this.toastr.error(statusText, error.status);
              break;
            }
            case 404: {
              const statusText = error.statusText == "OK" ? "Not Found" : error.statusText;
              this.toastr.error(statusText, error.status);
              this.router.navigateByUrl("/not-found");
              break;
            }
            case 400: {
              const statusText = error.statusText == "OK" ? "Bad Request" : error.statusText;
              if (error.error.errors) {
                const modalStateErrors = [];
                const errors = error.error.errors;

                for (const key in errors) {
                  if (errors[key]) {
                    modalStateErrors.push(errors[key]);
                  }
                }

                throw modalStateErrors;
              }
              else {
                this.toastr.error(statusText, error.status);
              }
              break;  
            }
            default:
              this.toastr.error("Oops, something went wrong");
              console.log(error);
              break;
          }
        }

        return throwError(error);
      })
    );
  }
}
