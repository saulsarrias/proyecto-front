import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DefaultComponent} from "./default.component";
import {DashboardComponent} from "../components/dashboard/dashboard.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/components/shared.module";
import {HomeComponent} from "../components/home/home.component";
import {RegisterComponent} from "../components/register/register.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from "../components/login/login.component";
import {ClienteComponent} from "../components/cliente/cliente.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FilterPipe} from "../../pipes/filter.pipe";
import {ClienteModalComponent} from "../components/cliente/cliente-modal/cliente-modal.component";
import {FacturaComponent} from "../components/factura/factura.component";
import {FacturaModalComponent} from "../components/factura/factura-modal/factura-modal.component";
import {LineaFacturaModalComponent} from "../components/factura/linea-factura-modal/linea-factura-modal.component";
import {InventarioComponent} from "../components/inventario/inventario.component";
import {OrderByPipe} from "../../pipes/order-by.pipe";
import {InventarioModalComponent} from "../components/inventario/inventario-modal/inventario-modal.component";
import {ObraComponent} from "../components/obra/obra.component";
import {ObraModalComponent} from "../components/obra/obra-modal/obra-modal/obra-modal.component";
import {ParteTrabajoComponent} from "../components/parte-trabajo/parte-trabajo.component";
import {TareaComponent} from "../components/parte-trabajo/tarea/tarea.component";
import {
  ParteTrabajoModalComponent
} from "../components/parte-trabajo/parte-trabajo-modal/parte-trabajo-modal.component";
import {TareaModalComponent} from "../components/parte-trabajo/tarea/tarea-modal/tarea-modal.component";
import {AuthService} from "../../services/auth.service";
import {ClienteService} from "../../services/cliente.service";
import {LoadingService} from "../../services/loading.service";
import {ApiService} from "../../services/api.service";
import {FacturaService} from "../../services/factura.service";
import {InventarioService} from "../../services/inventario.service";
import {LineaFacturaService} from "../../services/linea-factura.service";
import {ObraService} from "../../services/obra.service";
import {ParteTrabajoService} from "../../services/parte-trabajo.service";
import {SortingService} from "../../services/sorting.service";
import {TareaService} from "../../services/tarea.service";



@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    ClienteComponent,
    ClienteModalComponent,
    FacturaComponent,
    FacturaModalComponent,
    FilterPipe,
    LineaFacturaModalComponent,
    InventarioComponent,
    OrderByPipe,
    InventarioModalComponent,
    ObraComponent,
    ObraModalComponent,
    ParteTrabajoComponent,
    TareaComponent,
    ParteTrabajoModalComponent,
    TareaModalComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule
  ],
  providers: [
    AuthService,
    ClienteService,
    LoadingService,
    ApiService,
    FacturaService,
    InventarioService,
    LineaFacturaService,
    ObraService,
    ParteTrabajoService,
    SortingService,
    TareaService
  ]
})
export class DefaultModule { }
