import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  User:any;
  constructor(private userService:UserService, private router:Router){}

 async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  Promise<boolean>  {

    
    if(!this.userService.isLoggedIn()){
      this.userService.deleteToken();
      return false;
    }

    let stateName: string = state.url.replace("/", "");

    await this.userService.getUserRole().toPromise().then(
        data => {
          this.User = data; 
              
          if (Object.keys(route.data).length !== 0 && route.data['role'].indexOf(this.User.UserType) === -1 ) {
          
            this.router.navigate(['/']);
             return false;
           }else{
           
           }
        }
      );

      return true;
    }
  
}
