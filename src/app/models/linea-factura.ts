export class LineaFactura{
  id!: number;
  id_factura: number;
  concepto: string;
  base_unitaria: number;
  iva: number;
  precio: number;


  constructor(id_factura: number, concepto: string, base_unitaria: number, iva: number, precio: number) {
    this.id_factura = id_factura;
    this.concepto = concepto;
    this.base_unitaria = base_unitaria;
    this.iva = iva;
    this.precio = precio;
  }
}
