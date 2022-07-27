import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { HttpClientModule }    from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-front-desk-login',
  templateUrl: './front-desk-login.component.html',
  styleUrls: ['./front-desk-login.component.scss']
})
export class FrontDeskLoginComponent implements OnInit {
 
  formSubmitAttempt: boolean = false;
  loginDetails!: FormGroup;
  displayStyle = "none";
  message = "";
  checkSubscriptionStatus:any;
  userType:any;


  constructor(private formBuilder: FormBuilder,private userService: UserService,private httpClientModule:HttpClientModule,private router:Router) { }

  async	ngOnInit() {
	  
	/*	this.checkSubscriptionStatus = await this.userService.checkSubscriptionStatus().toPromise();
		this.userType = await this.checkSubscriptionStatus.userType;

		if(this.userService.isLoggedIn() && this.userType =='HOTEL_OWNER'){
			this.router.navigate(['home']);
		}else if(this.userService.isLoggedIn() && this.userType =='FRONTDESK'){
			this.router.navigate(['front-desk-home']);
		}*/

   		 this.loginDetails = this.formBuilder.group({
		  username: ['', Validators.required],
		  password: ['', Validators.required]
		});
  	}


	get inputdata() {
		return this.loginDetails.controls;
	}

 	submit() {
		if(this.loginDetails.valid){
			this.formSubmitAttempt = true;		
			let params:any = {		
				'username':this.loginDetails.value.username,			
				'password':this.loginDetails.value.password,
			}

			this.userService.loginUserFrontDesk(params).subscribe(
				(res:any) =>{
					this.userService.setToken(res['token']);
					this.router.navigateByUrl('front-desk-home');
				},
				(err:any)=>{
					this.displayStyle = "block";
					this.message = 'Incorrect Password';
				}
			);
		}

	}

  	closePopup() {
		this.displayStyle = "none";
	}

}
