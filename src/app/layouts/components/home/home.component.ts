import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Emitters} from "../../../emitters/emitter";
import {AuthService} from "../../../services/auth.service";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  message = 'You are not logged';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
    this.authService.checkAuthentication().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        console.log('El usuario está autenticado.');

      } else {
        console.log('El usuario no está autenticado.');

      }
    });
  }

}
