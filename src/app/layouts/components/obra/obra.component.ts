import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../services/loading.service";
import {ObraService} from "../../../services/obra.service";
import {Obra} from "../../../models/obra";
import {SortingService} from "../../../services/sorting.service";
import {ObraModalComponent} from "./obra-modal/obra-modal/obra-modal.component";
import {Cliente} from "../../../models/cliente";
import {ClienteService} from "../../../services/cliente.service";
import {forkJoin} from "rxjs";
import {ClienteModalComponent} from "../cliente/cliente-modal/cliente-modal.component";
import {Factura} from "../../../models/factura";

@Component({
  selector: 'app-obra',
  templateUrl: './obra.component.html',
  styleUrls: ['./obra.component.css']
})
export class ObraComponent implements OnInit{
  clientes: Cliente[] = [];
  obras: Obra[] = [];
  obrasCliente: Obra[] = [];
  bsModalRef!: BsModalRef;
  searchText: any;
  public page = 1;
  public pageSize = 10;
  cliente = '';

  constructor(
    private authService: AuthService,
    private modalService: BsModalService,
    private router: Router,
    public loadingService: LoadingService,
    private obraService: ObraService,
    public sortingService: SortingService,
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute
  ) {
  }
  ngOnInit(): void {
    this.loadingService.setLoadingState(true);
    this.authService.checkAuthentication().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.activatedRoute.paramMap.subscribe(params => {
          const obrasCliente: Obra[] = history.state.obras_cliente;
          const clienteSeleccionado: Cliente = history.state.clienteSeleccionado;

          this.obraService.actualizacionObras$.subscribe(() => {
            this.getAll();
          });

          if (obrasCliente != null) {
            this.obrasCliente = obrasCliente;
            this.obras = obrasCliente;
            this.cliente = clienteSeleccionado.nombre;
            this.clientes.push(clienteSeleccionado);
          } else {
            forkJoin([this.obraService.getAll(), this.clienteService.getAllClientes()])
                .subscribe(([obras, clientes]) => {
                  this.obras = obras;
                  this.clientes = clientes;
                  this.addCliente();
                  this.loadingService.setLoadingState(false);
                });
          }
        });
      } else {
        this.loadingService.setLoadingState(false);
        this.router.navigate(['/']);
      }
    });
  }

  getAll(){
    this.loadingService.setLoadingState(true);
    this.obraService.getAll()
      .subscribe({
        next:obras => {
      this.obras = obras;
      this.loadingService.setLoadingState(false);
      console.log(obras); // Aquí puedes manipular los clientes recibidos
    },
    error:error => {
      this.loadingService.setLoadingState(false);
      console.error('Error al obtener obras:', error);
    }
  });
  }

  delete(id: number){
    this.obraService.delete(id).subscribe(
      response => {
        console.log('Obra eliminado exitosamente:', response);
        this.getAll();
      },
      error => {
        console.error('Error al eliminar el cliente:', error);
      }
    );
  }

  showModal() {
    this.bsModalRef = this.modalService.show(ObraModalComponent, {
      initialState: {
        obra: undefined,
        clientes: this.clientes
      }
    });
  }

  showModalUpdate(obra: Obra) {
    this.bsModalRef = this.modalService.show(ObraModalComponent, {
      initialState: {
        obra: obra,
        isUpdate: true,
        clientes: this.clientes
      }
    });
  }

  getClienteById(id: number){
    this.clienteService.find(id).subscribe({
      next:cliente =>{
        console.log(cliente);
        this.showModalInfo(cliente);
      },
      error:error =>{
        console.log(error);
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
          console.log(clientes);
        },
        error => {
          this.loadingService.setLoadingState(false);
          console.error('Error al obtener clientes:', error);
        }
      );
  }

 showModalInfo(cliente: Cliente) {
    this.bsModalRef = this.modalService.show(ClienteModalComponent, {
      initialState: {
        cliente: cliente,
        isInfo: true
      }
    });
  }
  addCliente(){
    this.obras.forEach((obra) => {
      const cliente = this.clientes.find((cliente) => cliente.id === obra.id_cliente);
      if (cliente) {
        obra.nombre_cliente = cliente.nombre;
      }
    });
    console.log(this.obras);
  }

}
