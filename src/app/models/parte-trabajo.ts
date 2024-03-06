export class ParteTrabajo{
    id!: number;
    id_user: number;
    id_obra: number;
    fecha_parte: string;
    nombre_empleado!: string;

    constructor(id_user: number, id_obra: number, fecha_parte: string) {
        this.id_user = id_user;
        this.id_obra = id_obra;
        this.fecha_parte = fecha_parte;
    }
}
