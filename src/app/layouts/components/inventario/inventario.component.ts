import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

import {LoadingService} from "../../../services/loading.service";
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FacturaService} from "../../../services/factura.service";
import {SortingService} from "../../../services/sorting.service";
import {LineaFacturaService} from "../../../services/linea-factura.service";
import {ClienteService} from "../../../services/cliente.service";
import {Inventario} from "../../../models/inventario";
import {InventarioService} from "../../../services/inventario.service";
import {InventarioModalComponent} from "./inventario-modal/inventario-modal.component";


@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit{

  materiales: Inventario[] = [];
  bsModalRef!: BsModalRef;
  searchText: any;
  public page = 1;
  public pageSize = 10;

  constructor(
      public loadingService: LoadingService,
      private authService: AuthService,
      private router: Router,
      public sortingService: SortingService,
      private modalService: BsModalService,
      private inventarioService: InventarioService
  ) {
  }
  ngOnInit(): void {
    this.loadingService.setLoadingState(true);
    this.authService.checkAuthentication().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.inventarioService.actualizacionInventario$.subscribe(() => {
          this.getMateriales();
        });
        this.getMateriales();
        this.loadingService.setLoadingState(false);
      } else {
        this.loadingService.setLoadingState(false);
        console.log('El usuario no está autenticado.');
        this.router.navigate(['/']);
      }
    });
  }

  showModalUpdate(material: Inventario){
    this.bsModalRef = this.modalService.show(InventarioModalComponent, {
      initialState: {
        material: material,
        isUpdate: true
      }
    });
  }
  showModal(){
    this.bsModalRef = this.modalService.show(InventarioModalComponent, {
      initialState: {
        material: undefined
      }
    });
  }

  delete(id: number){
    this.inventarioService.delete(id).subscribe({
      next:response =>{
        console.log(response);
      }, error:err => {
        console.log(err);
      }
    });
  }

  getMateriales(){
    this.inventarioService.getInventario().subscribe({
      next:material =>{
        this.materiales = material;
      }, error:error =>{
        console.log(error);
    }
    });
  }
}
