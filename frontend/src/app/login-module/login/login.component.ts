import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { HttpClientModule }    from '@angular/common/http';
import { Router } from "@angular/router";
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formSubmitAttempt: boolean = false;
  loginDetails!: FormGroup;
  displayStyle = "none";
  message = "";
  checkSubscriptionStatus:any;
  userType:any;

  passwordType='password';
  passwordImage = 'eye.svg';
  dispalyPasswordTypeEyeClose = "none";
  dispalyPasswordTypeEye = "Block";

  constructor(private formBuilder: FormBuilder,private userService: UserService,private httpClientModule:HttpClientModule,private router:Router) { }

  async	ngOnInit() {
		this.loginDetails = this.formBuilder.group({
			email: ['', [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
			password: ['', Validators.required]
		});

		this.checkSubscriptionStatus = await this.userService.checkSubscriptionStatus().toPromise();
		this.userType = await this.checkSubscriptionStatus.userType;
		if(this.userService.isLoggedIn() && this.userType =='HOTEL_OWNER'){
			this.router.navigate(['home']);
		}else if(this.userService.isLoggedIn() && this.userType =='FRONTDESK'){
			this.router.navigate(['front-desk-home']);
		}
		
		
  	}
	 
	changePasswordType(){
		this.passwordType = "text";
		this.passwordImage = 'eye-close.svg';
		this.dispalyPasswordTypeEyeClose = "block";
		this.dispalyPasswordTypeEye = "none";
	}

	ResetChangePasswordType(){
		this.passwordType = "password";
		this.passwordImage = 'eye.svg';
		this.dispalyPasswordTypeEyeClose = "none";
		this.dispalyPasswordTypeEye = "block";
	}

	get inputdata() {
		return this.loginDetails.controls;
	}

 	submit() {
		if(this.loginDetails.valid){
			this.formSubmitAttempt = true;		
			let params:any = {		
				'email':this.loginDetails.value.email,			
				'password':this.loginDetails.value.password,
			}

			this.userService.loginUser(params).subscribe(
				(res:any) =>{
					
					this.userService.setToken(res['token']);				
					this.router.navigateByUrl('home');
				},
				(err:any)=>{
				//	console.log(err)
					this.displayStyle = "block";
					this.message = err.error.message;
				}
			);
		}

	}

  	closePopup() {
		this.displayStyle = "none";
	}

}
