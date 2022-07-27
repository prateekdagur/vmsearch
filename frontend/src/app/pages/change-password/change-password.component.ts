import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { HttpClientModule }    from '@angular/common/http';
import { Router } from "@angular/router";
import { MustMatch } from '../../_helpers/must-match.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  formResetPassword!: FormGroup;
  displayStyle = "none";
  message = "";
  formSubmitAttempt:boolean=false;

  passwordType='password';
  passwordImage = 'eye.svg';
  dispalyPasswordTypeEyeClose = "none";
  dispalyPasswordTypeEye = "Block";

  ConfirmpasswordType='password';
  ConfirmpasswordImage = 'eye.svg';
  ConfirmdispalyPasswordTypeEyeClose = "none";
  ConfirmdispalyPasswordTypeEye = "Block";

  constructor(private formBuilder: FormBuilder,private userService: UserService,private httpClientModule:HttpClientModule,private router:Router) { }

  ngOnInit(): void {
    
    this.formResetPassword = this.formBuilder.group({
      password: ['', [Validators.required,Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$")]],
      cpassword: ['', [Validators.required]]
    }, {
      validator: MustMatch('password', 'cpassword')
  });

  }

  get getInput() {
		return this.formResetPassword.controls;
	}

  changePassword(){
    this.formSubmitAttempt = true;
    if(this.formResetPassword.valid){
        let params:any = {		
          'password':this.formResetPassword.value.password
        }
        this.userService.changePassword(params).subscribe(
          (res:any) =>{
            this.displayStyle = "block";
            this.message = 'Password Changed Successfully.';
            setTimeout(() => {
              this.router.navigateByUrl('my-account');
            }, 2000);
          },
          (err:any)=>{
            this.displayStyle = "block";
            this.message = err.error.message;
          }
        );
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

  closePopup() {
		this.displayStyle = "none";
	}

}
