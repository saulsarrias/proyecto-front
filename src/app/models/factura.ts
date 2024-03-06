export class Factura{
  id!: number;
  id_cliente: number;
  id_obra: number;
  fecha_emision: string;
  monto: number;
  estado_pago: string;
  retencion:number;
  pie_factura: string;
  nombre_cliente!: string;


  constructor(id_cliente: number, id_obra: number, fecha_emision: string, monto: number, estado_pago: string, retencion: number, pie_factura: string) {
    this.id_cliente = id_cliente;
    this.id_obra = id_obra;
    this.fecha_emision = fecha_emision;
    this.monto = monto;
    this.estado_pago = estado_pago;
    this.retencion = retencion;
    this.pie_factura = pie_factura;
  }
}
