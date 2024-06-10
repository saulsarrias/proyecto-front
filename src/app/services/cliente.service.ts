import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Cliente} from "../models/cliente";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8000/api';
  //private apiUrl = 'https://proyecto-back-tigw4.ondigitalocean.app/api'; // URL del backend API
  private actualizacionClienteSource = new Subject<void>();

  actualizacionCliente$ = this.actualizacionClienteSource.asObservable();

  constructor(private http: HttpClient) { }

  actualizarCliente(): void {
    this.actualizacionClienteSource.next();
  }

  headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  getAllClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl+'/clientes',  { headers: this.headers });
  }

  save(cliente: Cliente): Observable<Cliente[]> {
    return this.http.post<Cliente[]>(this.apiUrl+'/clientes/store', cliente, { headers: this.headers });
  }

  delete(id: number): Observable<Cliente[]> {
    return this.http.delete<Cliente[]>(this.apiUrl+'/clientes/'+id, { headers: this.headers });
  }

  update(id: number, cliente: Cliente): Observable<Cliente[]> {
    return this.http.put<Cliente[]>(this.apiUrl+'/clientes/'+id, cliente, { headers: this.headers });
  }
  find(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(this.apiUrl+'/clientes/'+id, { headers: this.headers });
  }

}
