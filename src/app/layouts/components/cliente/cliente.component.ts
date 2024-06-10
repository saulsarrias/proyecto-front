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
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  authenticated = false;
  clientes: Cliente[] = [];
  facturas: Factura [] = [];
  obras: Obra [] = [];
  bsModalRef!: BsModalRef;
  searchText: any;
  public page = 1;
  public pageSize = 8;

  images: string[] = [
    'assets/images/cascada.jpg',
    'assets/images/jungla.jpg',
    'assets/images/space.jpg',
    // Añade aquí todas las imágenes disponibles en tu directorio
  ];


  constructor(
    private clienteService: ClienteService,
    private authService: AuthService,
    private modalService: BsModalService,
    private router: Router,
    public loadingService: LoadingService,
    private obraService: ObraService,
    private facturaService: FacturaService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.setTitle("Clientes");

    this.authService.checkAuthentication().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.authenticated = true;
        this.getAllClientes();
        this.clienteService.actualizacionCliente$.subscribe(() => {
          this.getAllClientes();

        });
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  getRandomImage(): string {
    const randomIndex = Math.floor(Math.random() * this.images.length);
    return this.images[randomIndex];
  }

  getAllClientes() {
    this.loadingService.setLoadingState(true);
    this.clienteService.getAllClientes()
      .subscribe(
        clientes => {
          this.clientes = clientes;
          this.loadingService.setLoadingState(false);
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

