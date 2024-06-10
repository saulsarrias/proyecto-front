import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Obra} from "../models/obra";
import {Factura} from "../models/factura";
import {Cliente} from "../models/cliente";

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private apiUrl = 'http://localhost:8000/api';

  //private apiUrl = 'https://proyecto-back-tigw4.ondigitalocean.app/api'; // URL del backend API
  private actualizacionFacturaSource = new Subject<void>();

  actualizacionFacturas$ = this.actualizacionFacturaSource.asObservable();

  headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  constructor(private http: HttpClient) {

  }


  actualizarFactura(): void {
    this.actualizacionFacturaSource.next();
  }

  getAll(): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.apiUrl+'/facturas',  { headers: this.headers });
  }

  save(factura: Factura): Observable<Factura[]> {
    return this.http.post<Factura[]>(this.apiUrl+'/facturas/store', factura,  { headers: this.headers });
  }

  delete(id: number): Observable<Factura[]> {
    return this.http.delete<Factura[]>(this.apiUrl+'/facturas/'+id,  { headers: this.headers });
  }

  update(id: number, factura: Factura): Observable<Factura[]> {
    return this.http.put<Factura[]>(this.apiUrl+'/facturas/'+id, factura,  { headers: this.headers });
  }

  find(id: number): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.apiUrl+'/facturas/'+id,  { headers: this.headers });
  }
}
