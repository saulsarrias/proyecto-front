import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loadingState = this.loadingSubject.asObservable();

  constructor() { }

  // Método para cambiar el estado de carga
  setLoadingState(state: boolean): void {
    this.loadingSubject.next(state);
  }
}
