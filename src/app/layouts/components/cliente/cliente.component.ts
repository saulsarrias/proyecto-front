import {Component, OnInit} from '@angular/core';
import {Cliente} from "../../../models/cliente";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ClienteService} from "../../../services/cliente.service";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {LoadingService} from "../../../services/loading.service";

import {ClienteModalComponent} from "./cliente-modal/cliente-modal.component";
import {ObraService} from "../../../services/obra.service";
import {FacturaService} from "../../../services/factura.service";
import {Factura} from "../../../models/factura";
import {Obra} from "../../../models/obra";


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  authenticated = false;
  message = 'You are not logged';
  clientes: Cliente[] = [];
  facturas: Factura [] = [];
  obras: Obra [] = [];
  bsModalRef!: BsModalRef;
  searchText: any;
  public page = 1;
  public pageSize = 10;
  constructor(
    private clienteService: ClienteService,
    private authService: AuthService,
    private modalService: BsModalService,
    private router: Router,
    public loadingService: LoadingService,
    private obraService: ObraService,
    private facturaService: FacturaService
  ) { }

  ngOnInit() {
    this.loadingService.setLoadingState(true);
    this.authService.checkAuthentication().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        console.log('El usuario está autenticado.');
        this.authenticated = true;
        this.getAllClientes();
        this.clienteService.actualizacionCliente$.subscribe(() => {
          this.getAllClientes();
        });
      } else {
        console.log('El usuario no está autenticado.');
        this.router.navigate(['/']);
      }
    });
  }
  getAllClientes() {
    this.loadingService.setLoadingState(true);
    this.clienteService.getAllClientes()
      .subscribe(
        clientes => {
          this.clientes = clientes;
          this.loadingService.setLoadingState(false);
          console.log(clientes); // Aquí puedes manipular los clientes recibidos
        },
        error => {
          this.loadingService.setLoadingState(false);
          console.error('Error al obtener clientes:', error);
        }
      );
  }
  delete(id: number){
    this.clienteService.delete(id).subscribe(
      response => {
        console.log('Cliente eliminado exitosamente:', response);
        this.getAllClientes();
      },
      error => {
        console.error('Error al eliminar el cliente:', error);
      }
    );
  }

  showModal() {
    this.bsModalRef = this.modalService.show(ClienteModalComponent, {
      initialState: {
        cliente: undefined
      }
    });
  }

  showModalUpdate(cliente: Cliente) {
    this.bsModalRef = this.modalService.show(ClienteModalComponent, {
      initialState: {
        cliente: cliente,
        isUpdate: true
      }
    });
  }

  getObrasById(id: number, cliente: Cliente){
    this.obraService.getById(id).subscribe({
      next:obra => {
        this.obras = obra;
        this.router.navigate(['/obras'], { state: { obras_cliente: this.obras, clienteSeleccionado: cliente } });
      }, error:error =>{
        console.log(error);
    }
    });
  }

  getFacturasById(id: number, cliente: Cliente){
    this.facturaService.find(id).subscribe({
      next:factura =>{

        this.facturas = factura;
        this.router.navigate(['/facturas'], { state: { facturas_cliente: this.facturas, clienteSeleccionado: cliente } });
      }, error:error => {
        console.log(error);
    }
    });
  }
}

