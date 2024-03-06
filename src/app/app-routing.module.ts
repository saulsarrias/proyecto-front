import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./layouts/components/home/home.component";
import {LoginComponent} from "./layouts/components/login/login.component";
import {RegisterComponent} from "./layouts/components/register/register.component";

import {ObraComponent} from "./layouts/components/obra/obra.component";
import {DefaultComponent} from "./layouts/default/default.component";
import {DashboardComponent} from "./layouts/components/dashboard/dashboard.component";
import {ClienteComponent} from "./layouts/components/cliente/cliente.component";
import {FacturaComponent} from "./layouts/components/factura/factura.component";
import {InventarioComponent} from "./layouts/components/inventario/inventario.component";
import {ParteTrabajoComponent} from "./layouts/components/parte-trabajo/parte-trabajo.component";

const routes: Routes = [{


  /*{path: '', component: HomeComponent},
  path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'obras', component: ObraComponent},
  {*/
    path: '', component: DefaultComponent,
    children: [{
        path: 'dashboard', component: DashboardComponent
    }, {
        path: '', component: HomeComponent
    }, {
        path: 'clientes', component: ClienteComponent
    }, {
      path: 'obras', component: ObraComponent
    }, {
      path: 'facturas', component: FacturaComponent
    }, {
        path: 'inventario', component: InventarioComponent
    }, {
        path: 'partes', component: ParteTrabajoComponent
    }]
  }];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
