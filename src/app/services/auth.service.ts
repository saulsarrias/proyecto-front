import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {BehaviorSubject, catchError, map, Observable, of, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api/user';
  //private apiUrl = 'https://proyecto-back-tigw4.ondigitalocean.app/api/user';

  constructor(private http: HttpClient) { }
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  checkAuthentication(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      });
      return this.http.get(this.apiUrl, { headers: headers }).pipe(
        map((res: any) => {
          return true;
        }),
        catchError(err => {
          return of(false);
        })
      );
    } else {
      console.error('No se encontró el token en el Local Storage');
      return throwError('No se encontró el token en el Local Storage');
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
