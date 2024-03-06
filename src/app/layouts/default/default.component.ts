import {Component, OnInit} from '@angular/core';
import {Emitters} from "../../emitters/emitter";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit{
  constructor(private router: Router, private authService: AuthService) {

  }
  ngOnInit(): void {
    this.authService.checkAuthentication().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        console.log('El usuario está autenticado.');
        this.authService.isAuthenticatedSubject.next(true);
      } else {
        console.log('El usuario no está autenticado.');
        this.router.navigate(['/']);
      }
    });
  }


}
