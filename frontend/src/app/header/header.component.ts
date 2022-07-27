import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";
import { dataService } from 'src/app/shared/dataservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  displayStyle = "none";
  displayStyleSearch= "none";
  message:any;
  isActive:any;
  searchResult:any;
  searchValue:any;
  notificationCount:any;
  dataNotification:any;
  checkSubscriptionStatus:any;
  userType:any;
  
  constructor(private userService:UserService, private router:Router,private service: dataService) { }

  ngOnInit(): void {

    (async () => {

      this.checkSubscriptionStatus = await this.userService.checkSubscriptionStatus().toPromise();
     // console.log('checkSubscriptionStatus',this.checkSubscriptionStatus);
      this.userType = await this.checkSubscriptionStatus.userType;

      if(this.userType == 'HOTEL_OWNER' || this.userType == 'FRONTDESK'){
       
        if(this.checkSubscriptionStatus.statusText === "error_subscription" && this.userType == 'HOTEL_OWNER'){
          this.router.navigate(['subscription/'+this.checkSubscriptionStatus.hotelId]);
        }

        if(this.checkSubscriptionStatus.statusText === "inactive" && this.userType == 'HOTEL_OWNER' ){
          this.displayStyle = "block";
          this.message = "Your account is not approved yet. Please contact admin!";
          this.router.navigate(['home']);
        }


        if(this.checkSubscriptionStatus.subscriptionStatus === "INACTIVE" && this.userType == 'FRONTDESK' ){
          this.displayStyle = "block";
          this.message = "Your hotel subscription is expired. Please contact hotel owner!";
          this.router.navigate(['front-desk-home']);
        }
        
        this.dataNotification = await this.userService.notificationList(0).toPromise();
        this.notificationCount = this.dataNotification.notificationCount;

        var newstr =  this.router.url.replace('/', "");  
        this.isActive = newstr;
  
      }else{
        this.userService.deleteToken();
        this.router.navigate(['login'])
      }

      
    })();
     
  }

  searchGuest(event){
    this.searchValue = event.target.value;
    this.userService.searchGuest(this.searchValue).subscribe(
      (res:any) =>{ 
          if(res.statusText == "success"){ 
            this.searchResult = res.user;
          }
      });
  }
  

  searchGuestLiting(){
    this.displayStyleSearch= "none";
    this.router.navigate(['/search-result/'+this.searchValue]).then(() => {
      window.location.reload();
    });
  }


  openSearch() {
    this.displayStyleSearch= "block";
    
  }

  closeSearch(){
    this.displayStyleSearch= "none";
  }


  onLogout(){
    this.userService.deleteToken();
    if(this.userType == 'FRONTDESK'){
      this.router.navigate(['/front-desk-login']);
    }else{
      this.router.navigate(['/login']);
    }
    
    
  }

  closePopup() {
		this.displayStyle = "none";
	}



}
