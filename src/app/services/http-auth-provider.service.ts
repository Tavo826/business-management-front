import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { User } from '../interfaces/user.models';
import { Observable, map, catchError } from 'rxjs';
import { AuthTokenResponse, LoginRequest } from '../interfaces/auth.models';
import { SessionService } from '../shared/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class HttpAuthProviderService {

  private http = inject(HttpClient)
  private sessionService = inject(SessionService)

  private apiUrl = environment.apiURL
  private usersEndpoint = "users/"

  constructor() {}

  public registerUser(model: User): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(this.apiUrl + this.usersEndpoint, model)
      .pipe(
        map((response: AuthTokenResponse) => this.sessionService.handleAuthentication(response)),
        catchError(this.sessionService.handleError)
      )
  }

  public logUser(model: LoginRequest): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(this.apiUrl + this.usersEndpoint + "auth", model)
      .pipe(
        map((response: AuthTokenResponse) => this.sessionService.handleAuthentication(response)),
        catchError(this.sessionService.handleLoginError)
      )
  }

  public getUserDetailById() {
    return this.http.get<User>(this.apiUrl + this.usersEndpoint + this.sessionService.getCurrentUserValue()?.documentId,
      this.sessionService.getAuthHeaders()
    )
      .pipe(
          map((response: User) => response),
          catchError(this.sessionService.handleError)
        )
  }

  public updateUser(id: string, model: User) : Observable<AuthTokenResponse> {

    return this.http.put<AuthTokenResponse>(this.apiUrl + this.usersEndpoint + id, model,
      this.sessionService.getAuthHeaders()
    )
    .pipe(
      map((response: AuthTokenResponse) => this.sessionService.handleAuthentication(response)),
      catchError(this.sessionService.handleError)
    )
  }

  public deleteUser(id: string): Observable<any> {

    return this.http.delete<any>(this.apiUrl + this.usersEndpoint + id,
      this.sessionService.getAuthHeaders()
    )
      .pipe(
        map((response: any) => response),
        catchError(this.sessionService.handleError)
      );
  }
}
