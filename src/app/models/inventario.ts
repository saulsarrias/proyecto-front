export class Inventario{
    id!: number;
    nombre: string;
    descripcion: string;
    cantidad:number;

    constructor(nombre: string, descripcion: string, cantidad: number) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.cantidad = cantidad;
    }
}
