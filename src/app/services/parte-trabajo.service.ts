import { Injectable } from '@angular/core';
import {Observable, Subject, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Factura} from "../models/factura";
import {ParteTrabajo} from "../models/parte-trabajo";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class ParteTrabajoService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // URL del backend API
  private actualizacionParteSource = new Subject<void>();

  headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  actualizacionPartes$ = this.actualizacionParteSource.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  actualizarParte(): void {
    this.actualizacionParteSource.next();
  }

  getAll(): Observable<ParteTrabajo[]> {
    return this.http.get<ParteTrabajo[]>(this.apiUrl+'/partes', { headers: this.headers });
  }

  save(parteTrabajo: ParteTrabajo): Observable<ParteTrabajo[]> {
    return this.http.post<ParteTrabajo[]>(this.apiUrl+'/partes/store', parteTrabajo, { headers: this.headers });
  }

  delete(id: number): Observable<ParteTrabajo[]> {
    return this.http.delete<ParteTrabajo[]>(this.apiUrl+'/partes/'+id, { headers: this.headers });
  }

  update(id: number, parteTrabajo: ParteTrabajo): Observable<ParteTrabajo[]> {
    return this.http.put<ParteTrabajo[]>(this.apiUrl+'/partes/'+id, parteTrabajo, { headers: this.headers });
  }


  find(fecha: string): Observable<ParteTrabajo[]> {
    // Obtener el token del Local Storage
      // Realizar la solicitud HTTP con los encabezados
      return this.http.get<ParteTrabajo[]>(`${this.apiUrl}/partes/${fecha}`, { headers: this.headers });
  }

}
