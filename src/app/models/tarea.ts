export class Tarea{
    id!: number;
    parte_trabajo_id: number;
    descripcion: string;
    personal_asignado: string
    precio_por_hora: number;
    horas_trabajadas: number;


    constructor(parte_trabajo_id: number, descripcion: string, personal_asignado: string, precio_por_hora: number, horas_trabajadas: number) {
        this.parte_trabajo_id = parte_trabajo_id;
        this.descripcion = descripcion;
        this.personal_asignado = personal_asignado;
        this.precio_por_hora = precio_por_hora;
        this.horas_trabajadas = horas_trabajadas;
    }
}
