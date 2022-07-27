import { Component } from '@angular/core';
import { UserService } from './shared/user.service';
import { RouterModule, Router, NavigationEnd } from "@angular/router";
@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vm-search';
  
  constructor(private userService:UserService, private router:Router){
    
  }

  ngOnInit() {}

  
   
}
