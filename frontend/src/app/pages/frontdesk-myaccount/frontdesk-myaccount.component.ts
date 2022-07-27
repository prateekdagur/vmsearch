import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { HttpClientModule, }    from '@angular/common/http';
import { Router } from "@angular/router";
import { MustMatch } from '../../_helpers/must-match.validator';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';

@Component({
  selector: 'app-frontdesk-myaccount',
  templateUrl: './frontdesk-myaccount.component.html',
  styleUrls: ['./frontdesk-myaccount.component.scss']
})
export class FrontdeskMyaccountComponent implements OnInit {

  
  formResetPassword!: FormGroup;
  displayStyle = "none";
  message = "";
  formSubmitAttempt:boolean=false;
  data:any;

  passwordType='password';
  passwordImage = 'eye.svg';
  dispalyPasswordTypeEyeClose = "none";
  dispalyPasswordTypeEye = "Block";

  ConfirmpasswordType='password';
  ConfirmpasswordImage = 'eye.svg';
  ConfirmdispalyPasswordTypeEyeClose = "none";
  ConfirmdispalyPasswordTypeEye = "Block";


  OldpasswordType='password';
  OldpasswordImage = 'eye.svg';
  OlddispalyPasswordTypeEyeClose = "none";
  OlddispalyPasswordTypeEye = "Block";


  constructor(private formBuilder: FormBuilder,private userService: UserService,private httpClientModule:HttpClientModule, private router:Router) { }

  ngOnInit(): void {

    this.formResetPassword = this.formBuilder.group({
      password: ['', [Validators.required,Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$")]],
      cpassword: ['', [Validators.required]],
      oldPassword: ['', [Validators.required]]
      }, {
        validator: MustMatch('password', 'cpassword')
    });


    this.userService.myAccountFrontDesk().subscribe(
      (res:any) =>{
        this.data = res;
      }
    );


  }


  get getInput() {
		return this.formResetPassword.controls;
	}


  changePassword(){
    this.formSubmitAttempt = true;
    if(this.formResetPassword.valid){
      
        let params:any = {		
          'password':this.formResetPassword.value.password,
          'oldPassword':this.formResetPassword.value.oldPassword
        }

        this.userService.changePasswordFront(params).subscribe(
          (res:any) =>{
            this.displayStyle = "block";
            this.message = res.message;          
          },
          (err:any)=>{
            this.displayStyle = "block";
            this.message = err.error.message;
          }
        );
    }
  }

  closePopup() {
		this.displayStyle = "none";
	}

  onLogout(){
    this.userService.deleteToken();
    this.router.navigate(['/front-desk-login']);
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


  changeConfirmPasswordType(){
		this.ConfirmpasswordType = "text";
		this.ConfirmpasswordImage = 'eye-close.svg';
		this.ConfirmdispalyPasswordTypeEyeClose = "block";
		this.ConfirmdispalyPasswordTypeEye = "none";
	}

	ResetConfirmChangePasswordType(){
		this.ConfirmpasswordType = "password";
		this.ConfirmpasswordImage = 'eye.svg';
		this.ConfirmdispalyPasswordTypeEyeClose = "none";
		this.ConfirmdispalyPasswordTypeEye = "block";
	}


  changeOldPasswordType(){
		this.OldpasswordType = "text";
		this.OldpasswordImage = 'eye-close.svg';
		this.OlddispalyPasswordTypeEyeClose = "block";
		this.OlddispalyPasswordTypeEye = "none";
	}

	ResetOldChangePasswordType(){
		this.OldpasswordType = "password";
		this.OldpasswordImage = 'eye.svg';
		this.OlddispalyPasswordTypeEyeClose = "none";
		this.OlddispalyPasswordTypeEye = "block";
	}

}
