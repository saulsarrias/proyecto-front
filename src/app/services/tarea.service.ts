import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ParteTrabajo} from "../models/parte-trabajo";
import {Tarea} from "../models/tarea";

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // URL del backend API
  private actualizacionTareaSource = new Subject<void>();

  actualizacionTareas$ = this.actualizacionTareaSource.asObservable();
  headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });
  constructor(private http: HttpClient) { }

  actualizarTarea(): void {
    this.actualizacionTareaSource.next();
  }

  getAll(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl+'/tareas',  { headers: this.headers });
  }

  save(tarea: Tarea): Observable<Tarea[]> {
    return this.http.post<Tarea[]>(this.apiUrl+'/tareas/store', tarea,  { headers: this.headers });
  }

  delete(id: number): Observable<Tarea[]> {
    return this.http.delete<Tarea[]>(this.apiUrl+'/tareas/'+id,  { headers: this.headers });
  }

  update(id: number, tarea: Tarea): Observable<Tarea[]> {
    return this.http.put<Tarea[]>(this.apiUrl+'/tareas/'+id, tarea,  { headers: this.headers });
  }

  find(id: number): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl+'/tareas/'+id,  { headers: this.headers });
  }
}
