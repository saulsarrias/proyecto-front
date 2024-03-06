import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from "ngx-bootstrap/modal";
import {AuthService} from "./services/auth.service";
import {ClienteService} from "./services/cliente.service";
import {LoadingService} from "./services/loading.service";
import {DefaultModule} from "./layouts/default/default.module";


@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    DefaultModule
  ],


  bootstrap: [AppComponent]
})
export class AppModule { }
