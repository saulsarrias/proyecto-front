import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://proyecto-back-tigw4.ondigitalocean.app/api';
  constructor(private http: HttpClient, private authService: AuthService) { }


  headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data /*, { withCredentials: true }*/);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {},  { headers: this.headers });
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // @ts-ignore
  getUsuarios(): Observable<any>{
    return this.http.get(`${this.apiUrl}/users`, { headers: this.headers });
  }




}
