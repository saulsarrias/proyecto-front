import {Component, OnInit} from '@angular/core';
import {Emitters} from "../../emitters/emitter";
import {HttpClient} from "@angular/common/http";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {LoginComponent} from "../../layouts/components/login/login.component";
import {RegisterComponent} from "../../layouts/components/register/register.component";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{
  authenticated = false;
  bsModalRef?: BsModalRef;
  constructor(
    private http: HttpClient,
    private modalService: BsModalService
  ) {

  }

  ngOnInit(): void {
    Emitters.authEmitter.subscribe(
      (auth:boolean) => {
        this.authenticated = auth;
      }
    );
  }

  logout() : void{
  this.http.post('http://localhost:8000/api/logout', {}, {withCredentials: true})
    .subscribe(() => this.authenticated = false);
  }

  showModal() {
    this.bsModalRef = this.modalService.show(LoginComponent);
  }

  showModalRegister() {
    this.bsModalRef = this.modalService.show(RegisterComponent);
  }
}
