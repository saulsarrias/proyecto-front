import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {HttpClient} from "@angular/common/http";
import {Emitters} from "../../../emitters/emitter";
import {LoginComponent} from "../../../layouts/components/login/login.component";
import {RegisterComponent} from "../../../layouts/components/register/register.component";
import {ApiService} from "../../../services/api.service";
import {AuthService} from "../../../services/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  bsModalRef?: BsModalRef;
  authenticated!: boolean;
  constructor(
    private modalService: BsModalService,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    console.log(this.authenticated);
    this.authService.isAuthenticated().subscribe(authenticated => {
      this.authenticated = authenticated;
    });
  }

  reloadPage(route: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([route]);
    });
  }

  logout() : void{
    this.apiService.logout()
      .subscribe({
        next:res => {
          this.authenticated = false;
          this.authService.logout();
          this.router.navigate(['/'])
        }
      });
  }

  showModal() {
    this.bsModalRef = this.modalService.show(LoginComponent);
  }

  showModalRegister() {
    this.bsModalRef = this.modalService.show(RegisterComponent);
  }
}


