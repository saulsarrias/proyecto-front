import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {BsModalRef} from "ngx-bootstrap/modal";
import {ApiService} from "../../../services/api.service";
import {Emitters} from "../../../emitters/emitter";
import {AuthService} from "../../../services/auth.service";
import {tap} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements  OnInit{
  form!: FormGroup;
  error = "";
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public bsModalRef: BsModalRef,
    private apiService: ApiService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: '',
      password: ''
    });
  }

  login(): void {
    this.apiService.login(this.form.getRawValue())
      .pipe(
        tap(data => {
          localStorage.setItem('token', data.token);
          this.authService.isAuthenticatedSubject.next(true);
          this.closeModal();
        })
      )
      .subscribe(
        () => this.router.navigate(['/dashboard']),
        error => {
          console.log(error['error'].message);
          this.error = error['error'].message;
        }
      );
  }

  closeModal(): void{
    this.bsModalRef.hide();
  }
}
