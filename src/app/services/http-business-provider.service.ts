import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SessionService } from '../shared/session/session.service';
import { environment } from '../../environment/environment';
import { Business } from '../interfaces/business.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpBusinessProviderService {

  private http = inject(HttpClient)
  private sessionService = inject(SessionService)

  private apiUrl = environment.apiURL
  private businessesEndpoint = "businesses/"

  constructor() { }

  public registerBusiness(model: Business) {
    return this.http.post<Business>(this.apiUrl + this.businessesEndpoint, model,
      this.sessionService.getAuthHeaders()
    )
    .pipe(
      map((response: Business) => response),
      catchError(this.sessionService.handleError)
    )
  }

  getBusinessListByUserId(userId: string) {
    return this.http.get<Business[]>(this.apiUrl + this.businessesEndpoint + "user/" + userId,
      this.sessionService.getAuthHeaders()
    )
    .pipe(
      map((response: Business[]) => response),
      catchError(this.sessionService.handleError)
    )
  }
}
