import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ApiService} from "../../../services/api.service";
import {LoginComponent} from "../login/login.component";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private bsModalRef: BsModalRef,
    private bsModalService: BsModalService
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: '',
      email: '',
      password: ''
    })
  }

  register(): void{

    this.apiService.register(this.form.getRawValue())
      .subscribe({
        next: () => {
          this.closeModal();
          this.bsModalRef = this.bsModalService.show(LoginComponent);
        },
        error: error => {
          console.log(error);
        }
      });
  }

  closeModal(): void{
    this.bsModalRef.hide();
  }

}
