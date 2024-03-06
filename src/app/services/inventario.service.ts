import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LineaFactura} from "../models/linea-factura";
import {Inventario} from "../models/inventario";

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private apiUrl = 'http://127.0.0.1:8000/api'; // URL del backend API
  private actualizacionInventarioSource = new Subject<void>();

  actualizacionInventario$ = this.actualizacionInventarioSource.asObservable();
  headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });
  constructor(private http: HttpClient) { }

  actualizarInventario(): void {
    this.actualizacionInventarioSource.next();
  }

  getInventario(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(this.apiUrl+'/inventario',  { headers: this.headers });
  }

  save(inventario: Inventario): Observable<Inventario[]> {
    return this.http.post<Inventario[]>(this.apiUrl+'/inventario/store', inventario,  { headers: this.headers });
  }

  delete(id: number): Observable<Inventario[]> {
    return this.http.delete<Inventario[]>(this.apiUrl+'/inventario/'+id,  { headers: this.headers });
  }

  update(id: number, inventario: Inventario): Observable<Inventario[]> {
    return this.http.put<Inventario[]>(this.apiUrl+'/inventario/'+id, inventario,  { headers: this.headers });
  }
}
