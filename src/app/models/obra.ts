export class Obra{
  id!: number;
  id_cliente: number;
  direccion: string;
  estado: string;
  fecha_inicio: string;
  fecha_fin_prevista: string;
  presupuesto: number;
  nombre_cliente!: string;


  constructor(
    id_cliente: number,
    direccion: string,
    estado: string,
    fecha_inicio: string,
    fecha_fin_prevista: string,
    presupuesto: number
  ) {
    this.id_cliente = id_cliente;
    this.direccion = direccion;
    this.estado = estado;
    this.fecha_inicio = fecha_inicio;
    this.fecha_fin_prevista = fecha_fin_prevista;
    this.presupuesto = presupuesto;
  }

}
