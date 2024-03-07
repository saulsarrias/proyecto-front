import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Obra} from "../models/obra";

@Injectable({
  providedIn: 'root'
})
export class ObraService {

  private apiUrl = 'https://proyecto-back-tigw4.ondigitalocean.app/api'; // URL del backend API
  private actualizacionObrasSource = new Subject<void>();

  actualizacionObras$ = this.actualizacionObrasSource.asObservable();
  headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });
  constructor(private http: HttpClient) { }

  actualizarObra(): void {
    this.actualizacionObrasSource.next();
  }

  getAll(): Observable<Obra[]> {
    return this.http.get<Obra[]>(this.apiUrl+'/obras',  { headers: this.headers });
  }

  save(obra: Obra): Observable<Obra[]> {
    return this.http.post<Obra[]>(this.apiUrl+'/obras/store', obra,  { headers: this.headers });
  }

  delete(id: number): Observable<Obra[]> {
    return this.http.delete<Obra[]>(this.apiUrl+'/obras/'+id,  { headers: this.headers });
  }

  update(id: number, obra: Obra): Observable<Obra[]> {
    return this.http.put<Obra[]>(this.apiUrl+'/obras/'+id, obra,  { headers: this.headers });
  }

  getById(id:number): Observable<Obra[]> {
    return this.http.get<Obra[]>(this.apiUrl+'/obras/'+id,  { headers: this.headers });
  }

}
