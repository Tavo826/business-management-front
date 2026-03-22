import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SessionService } from '../shared/session/session.service';
import { environment } from '../../environment/environment';
import { catchError, map } from 'rxjs';

export interface Order {
  id: string;
  client: string;
  date: string;
  status: string;
  amount: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpOrdersProviderService {

  private http = inject(HttpClient)
  private sessionService = inject(SessionService)

  private apiUrl = environment.apiURL
  private ordersEndpoint = "orders/"

  constructor() { }

  public getOrdersByBusinessId(businessId: string) {
    return this.http.get<Order[]>(this.apiUrl + this.ordersEndpoint + "business/" + businessId,
      this.sessionService.getAuthHeaders()
    )
      .pipe(
        map((response: Order[]) => response),
        catchError(this.sessionService.handleError)
      )
  }

  public getOrderById(id: string) {
    return this.http.get<Order>(this.apiUrl + this.ordersEndpoint + id,
      this.sessionService.getAuthHeaders()
    )
      .pipe(
        map((response: Order) => response),
        catchError(this.sessionService.handleError)
      )
  }
}
