import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {BehaviorSubject, catchError, map, Observable, of, throwError} from 'rxjs';
import {Emitters} from "../emitters/emitter";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  checkAuthentication(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get('https://proyecto-back-tigw4.ondigitalocean.app/api/user', { headers: headers }).pipe(
        map((res: any) => {
          return true;
        }),
        catchError(err => {
          return of(false);
        })
      );
    } else {
      // Manejar el caso en que el token no esté presente
      console.error('No se encontró el token en el Local Storage');
      // Puedes manejar esto retornando un observable de error o lanzando una excepción
      return throwError('No se encontró el token en el Local Storage');
    }
  }

  /*checkAuthentication(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.http.get('http://localhost:8000/api/user', { withCredentials: true })
        .subscribe(
          (res: any) => {
            Emitters.authEmitter.emit(true);
            observer.next(true);
          },
          err => {
            Emitters.authEmitter.emit(false);
            observer.next(false);
          }
        );
    });
  }*/

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
