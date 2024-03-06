import {Component, OnInit} from '@angular/core';
import {LoadingService} from "../../../services/loading.service";
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FacturaService} from "../../../services/factura.service";
import {Factura} from "../../../models/factura";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {SortingService} from "../../../services/sorting.service";
import {LineaFacturaService} from "../../../services/linea-factura.service";
import {LineaFactura} from "../../../models/linea-factura";
import {Cliente} from "../../../models/cliente";
import {FacturaModalComponent} from "./factura-modal/factura-modal.component";
import {ClienteService} from "../../../services/cliente.service";
import {Obra} from "../../../models/obra";
import jsPDF from 'jspdf';
import autoTable  from 'jspdf-autotable';
import {LineaFacturaModalComponent} from "./linea-factura-modal/linea-factura-modal.component";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {

    facturas: Factura[] = [];
    allFacturas: Factura [] = [];
    lineasFactura: LineaFactura[] = [];
    bsModalRef!: BsModalRef;
    facturasCliente: Factura[] = [];
    clientes: Cliente[] = [];
    obras: Obra[] = [];
    searchText: any;
    public page = 1;
    public pageSize = 10;
    facturaSeleccionada: Factura | null = null;
    cliente = '';

    constructor(
        public loadingService: LoadingService,
        private authService: AuthService,
        private router: Router,
        private facturaService: FacturaService,
        public sortingService: SortingService,
        private lineaFacturaService: LineaFacturaService,
        private activatedRoute: ActivatedRoute,
        private modalService: BsModalService,
        private clienteService: ClienteService
    ) {
    }

    ngOnInit(): void {
        this.loadingService.setLoadingState(true);
        this.authService.checkAuthentication().subscribe(isAuthenticated => {
            if (isAuthenticated) {
                this.facturaService.actualizacionFacturas$.subscribe(() => {
                    this.getFacturas();
                });
                this.activatedRoute.paramMap.subscribe(params => {
                    const facturasCliente: Factura[] = history.state.facturas_cliente;
                    const clienteSeleccionado: Cliente = history.state.clienteSeleccionado;
                    if (facturasCliente != null) {
                        this.facturasCliente = facturasCliente;
                        this.facturas = facturasCliente;
                        this.cliente = clienteSeleccionado.nombre;
                        this.clientes.push(clienteSeleccionado);
                    } else {
                        forkJoin([this.facturaService.getAll(), this.clienteService.getAllClientes()])
                            .subscribe(([facturas, clientes]) => {
                                this.facturas = facturas;
                                this.clientes = clientes;
                                this.addCliente();
                                this.loadingService.setLoadingState(false);
                            });

                    }
                });

            } else {
                this.loadingService.setLoadingState(false);
                console.log('El usuario no está autenticado.');
                this.router.navigate(['/']);
            }
        });
    }

    public getFacturas() {
        this.loadingService.setLoadingState(true);
        this.facturaService.getAll().subscribe({
            next: factura => {
                this.facturas = factura;
                this.loadingService.setLoadingState(false);
            }, error: error => {
                this.loadingService.setLoadingState(false);
                console.log(error);
            }
        });
    }

    /*getAllClientes(): void {
        this.clienteService.getAllClientes().subscribe(
            clientes => {
                this.clientes = clientes;
                console.log(clientes); // Aquí puedes manipular los clientes recibidos
            },
            error => {
                console.error('Error al obtener clientes:', error);
            }
        );
    }

    public getLineasFacturas() {
        this.loadingService.setLoadingState(true);
        this.lineaFacturaService.getLineas().subscribe({
            next: linea => {
                this.lineasFactura = linea;
                //console.log(this.lineasFactura);
            }, error: error => {
                console.log(error);
            }
        });
        this.loadingService.setLoadingState(false);
    }*/

    public getLineasFacturasById(id: number) {
        this.lineaFacturaService.getById(id).subscribe({
            next: linea => {
                console.log(linea);
                this.lineasFactura = linea;
            }, error: error => {
                console.log(error);
            }
        });
    }

    toggleDetalle(factura: Factura): void {
        if (this.facturaSeleccionada === factura) {
            this.facturaSeleccionada = null;
            this.lineasFactura = [];
        } else {
            this.facturaSeleccionada = factura;
            this.getLineasFacturasById(factura.id);
        }
    }

    showModal() {
        this.bsModalRef = this.modalService.show(FacturaModalComponent, {
            initialState: {
                clientes: this.clientes
            }
        });
    }


    showModalUpdate(factura: Factura) {
        this.bsModalRef = this.modalService.show(FacturaModalComponent, {
            initialState: {
                factura: factura,
                isUpdate: true,
                clientes: this.clientes
            }
        });
    }

    descargarFactura(factura: Factura) {
        const doc = new jsPDF();
        const imgData = '../../../../assets/images/logo.png';
        const fechaEmisionString = factura.fecha_emision;
        const fechaEmision = new Date(fechaEmisionString);
        const options = {year: 'numeric', month: '2-digit', day: 'numeric'};
        // @ts-ignore
        const fechaFormateada = fechaEmision.toLocaleDateString('es-ES', options);
        console.log(factura);
        this.lineaFacturaService.getById(factura.id).subscribe((lineasFactura: any[]) => {
            doc.setFontSize(16);
            doc.text("ESTRUCTURAS Y", 15, 10);
            doc.text("CONSTRUCCIONES", 15, 20);
            doc.text("ANDREU S.L", 15, 30);
            doc.addImage(imgData, 'PNG', 155, 5, 37, 45);
            doc.setFontSize(10); // Utiliza un tamaño de fuente más pequeño
            doc.text("Direccion: Calle Inventada 123. (Orihuela)", 15, 40);
            doc.text("Correo: construccionesandreu@gmail.com", 15, 45);
            doc.text("Telefono: +34 123 456 789", 15, 50);
            doc.text("www.construccionesandreu.com", 15, 55);
            doc.text("Factura nº: " + factura.id.toString(), 15, 70);
            doc.text("Fecha: " + fechaFormateada.toString(), 15, 75);
            const headers = [['ID', 'Concepto', 'Base Unitaria', 'Precio', 'Importe']];
            const data: any[][] = [];
            let total = 0;
            let id = 1;
            lineasFactura.forEach((linea: any) => {
                total = total + (linea.base_unitaria * linea.precio)
                console.log(total);
                const rowData = [
                    id.toString(),
                    linea.concepto,
                    linea.base_unitaria.toString(),
                    linea.precio.toString(),
                    (linea.base_unitaria * linea.precio).toString() + '€'
                ];
                id = id + 1;
                data.push(rowData);
            });
            data.push(['', '', '', 'IVA ' + factura.retencion + '%', (total * 0.21).toFixed(2) + '€']);
            data.push(['', '', '', 'Total', (total + (total * 0.21)).toFixed(2) + '€']);
            autoTable(doc, {
                head: headers,
                body: data,
                startY: 80,
            });
            const blob = doc.output('blob');
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        });
    }

    showLineaFacturaModal(id: number) {
        this.bsModalRef = this.modalService.show(LineaFacturaModalComponent, {
            initialState: {
                lineaFactura: undefined,
                id_factura: id

            }
        });
    }

    showLineaFacturaModalUpdate(linea: LineaFactura) {
        this.bsModalRef = this.modalService.show(LineaFacturaModalComponent, {
            initialState: {
                lineaFactura: linea,
                isUpdate: true
            }
        });
    }

    deleteFactura(id: number) {
        this.facturaService.delete(id).subscribe({
            next: response => {
                this.getFacturas();
            }, error: error => {
            console.log(error);
            }
        });
    }

    deleteLineaFactura(id: number) {
        this.lineaFacturaService.delete(id).subscribe({
            next: response => {
                this.getLineasFacturasById(id);
            }, error: error => {
                console.log(error);
            }
        });
    }

    addCliente(){
        this.facturas.forEach((factura) => {
            const cliente = this.clientes.find((cliente) => cliente.id === factura.id_cliente);
            if (cliente) {
                factura.nombre_cliente = cliente.nombre;
            }
        });
        console.log(this.facturas);
    }
}

