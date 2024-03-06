import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortingService {

  fieldName: string = ''; // Campo de ordenación actual
  reverse: boolean = false;
  constructor() { }
  sortBy(field: string) {
    if (this.fieldName === field) {
      this.reverse = !this.reverse; // Cambiar el orden
    } else {
      this.fieldName = field; // Cambiar el campo de ordenación
      this.reverse = false; // Reiniciar el orden a ascendente
    }
  }

  getSortIcon(column: string): string {
    if (this.fieldName === column) {
      return this.reverse ? '▿' : '▵'; // Triángulo hacia abajo o hacia arriba
    }
    return '⟠'; // No mostrar ningún carácter por defecto
  }

}
