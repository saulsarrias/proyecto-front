import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Factura} from "../models/factura";
import {LineaFactura} from "../models/linea-factura";

@Injectable({
  providedIn: 'root'
})
export class LineaFacturaService {
  private apiUrl = 'http://localhost:8000/api';
  //private apiUrl = 'https://proyecto-back-tigw4.ondigitalocean.app/api'; // URL del backend API
  private actualizacionLineaFacturaSource = new Subject<void>();

  actualizacionLineaFactura$ = this.actualizacionLineaFacturaSource.asObservable();
  headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });
  constructor(private http: HttpClient) { }

  actualizarLineaFactura(): void {
    this.actualizacionLineaFacturaSource.next();
  }

  getLineas(): Observable<LineaFactura[]> {
    return this.http.get<LineaFactura[]>(this.apiUrl+'/lineas-factura',  { headers: this.headers });
  }

  save(lineaFactura: LineaFactura): Observable<LineaFactura[]> {
    return this.http.post<LineaFactura[]>(this.apiUrl+'/lineas-factura/store', lineaFactura,  { headers: this.headers });
  }

  delete(id: number): Observable<LineaFactura[]> {
    return this.http.delete<LineaFactura[]>(this.apiUrl+'/lineas-factura/'+id,  { headers: this.headers });
  }

  update(id: number, lineaFactura: LineaFactura): Observable<LineaFactura[]> {
    return this.http.put<LineaFactura[]>(this.apiUrl+'/lineas-factura/'+id, lineaFactura,  { headers: this.headers });
  }

  getById(id: number): Observable<LineaFactura[]> {
    return this.http.get<LineaFactura[]>(this.apiUrl+'/lineas-factura/'+id,  { headers: this.headers });
  }
}
