import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";
@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
  displayStyle = "none";
  message:any;
  isActive:any;
  showDnrMenuOptions: boolean = false
  showDnrSubMenu: boolean = false
  showSubscriptionMenuOptions: boolean = false
  constructor(private userService:UserService, private router:Router) { }

  ngOnInit(): void {
    // this.userService.checkSubscriptionStatus().subscribe(
    //   (res:any) =>{
    //     console.log(res);
    //       if(res.statusText === "err"){
    //         this.router.navigate(['subscription']);
    //       }
    //       if(res.statusText === "inactive"){
    //         this.displayStyle = "block";
		// 	    	this.message = "Your account is not approved yet. Please contact admin!";
    //         this.router.navigate(['home']);
    //       }
    //   })

      var newstr =  this.router.url.replace('/', "");  
     this.isActive = newstr;
  }

  onAdminLogout(){
    this.userService.deleteAdminToken();
    this.router.navigate(['/admin']);
  }

  closePopup() {
		this.displayStyle = "none";
	}
  showDnr() {
     this.showDnrMenuOptions = !this.showDnrMenuOptions
      console.log( this.showDnrMenuOptions, "llllllllll")
   
  }
  showDnrSub() {
    this.showDnrSubMenu = !this.showDnrSubMenu
     console.log( this.showDnrSubMenu, "llllllllll")
  
 }
  showSubs() {
    this.showSubscriptionMenuOptions = !this.showSubscriptionMenuOptions
     console.log( this.showSubscriptionMenuOptions, "llllllllll")
  
 }

}