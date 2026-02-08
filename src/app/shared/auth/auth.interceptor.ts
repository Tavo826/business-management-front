import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SessionService } from "../session/session.service";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private sessionService: SessionService,
        private router: Router
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        const authToken = this.sessionService.getToken();

        if (authToken) {
            const authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${authToken}`)
            });
            return next.handle(authReq);
        } else {
            return next.handle(req).pipe(
                catchError((error: HttpErrorResponse) => {

                    if (error.status === 401 || error.status === 403) {
                        this.sessionService.logout();
                        this.router.navigate(['/home']);
                    }
                    return throwError(() => error);
                })
            );
        }
    }
}