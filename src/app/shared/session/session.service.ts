import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { User } from '../../interfaces/user.models';
import { Router } from '@angular/router';
import { AuthTokenResponse } from '../../interfaces/auth.models';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private currentUserSubject: BehaviorSubject<User | null>
  private currentUser$: Observable<User | null>
  private tokenKey = "token_key"

  private router = inject(Router)

  constructor() {
    const storedUser = this.getUserFromStorage()
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser)
    this.currentUser$ = this.currentUserSubject.asObservable()
  }

  getCurrentUserValue (): User | null {
    return this.currentUserSubject.value
  }

  getToken (): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getAuthHeaders() {
    const token = this.getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  isLoggedIn = (): boolean => {
    return !!this.getToken();
  }

  logout = (): void => {

    localStorage.removeItem(this.tokenKey)
    this.currentUserSubject.next(null)
    this.router.navigate(['/home'])
  }

  handleAuthentication (response: AuthTokenResponse): AuthTokenResponse {

    localStorage.setItem(this.tokenKey, response.token)
    this.currentUserSubject.next(this.getCurrentUserValue() || this.getUserFromStorage())

    return response
  }

  handleError = (error: any) => {
    let errorMessage = "An error ocurred in the request"

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`
    } else if (error.status) {
      errorMessage = `Error ${error.status}: ${error.error?.error || error.statusText}`

      if (error.status === 401 || error.status === 404) {
        this.logout()
      }
    }

    return throwError(() => new Error(errorMessage))
  }

  handleLoginError (error: any) {
    let errorMessage = "An error ocurred in the request"

    console.log(error)

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`
    } else if (error.status) {

      if (error.status === 401) {
        errorMessage = 'Invalid credentials'
      } else {
        errorMessage = `${error.status}: ${error.error?.title || error.statusText}`
      }
    }

    return throwError(() => new Error(errorMessage))
  }

  private getUserFromStorage(): User | null {
    const token = this.getToken()

    if (token) {
      try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))

        const payload = JSON.parse(jsonPayload)

        return {
          documentId: payload.documentId,
          documentType: payload.documentType,
          name: payload.name,
          surname: payload.surname,
          email: payload.sub,
          password: "",
          birthdate: payload.birthdate,
          createdAt: payload.createdAt,
          updatedAt: payload.updatedAt
        }
      } catch (e) {
        this.logout()
        return null
      }
    }

    return null
  }
}
