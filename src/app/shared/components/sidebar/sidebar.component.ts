import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {forkJoin} from "rxjs";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{
  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  authenticated = true;
  constructor(private authService: AuthService, private router: Router) {
  }
  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);

  ngOnInit(): void {

    this.authService.checkAuthentication().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        console.log(this.authenticated);
        this.authenticated = true;
      } else {
      }
    });
  }
}
