import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SessionService } from '../shared/session/session.service';
import { environment } from '../../environment/environment';
import { Order } from '../interfaces/order.model';
import { catchError, map } from 'rxjs';

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
    return this.http.get<Order[]>(this.apiUrl + this.ordersEndpoint + businessId + "/business",
      this.sessionService.getAuthHeaders()
    )
      .pipe(
        map((response: Order[]) => response),
        catchError(this.sessionService.handleLoginError)
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

  public updateOrder(id: string, model: Partial<Order>) {
    return this.http.put<Order>(this.apiUrl + this.ordersEndpoint + id, model,
      this.sessionService.getAuthHeaders()
    )
      .pipe(
        map((response: Order) => response),
        catchError(this.sessionService.handleError)
      )
  }
}
