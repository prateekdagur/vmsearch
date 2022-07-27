import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { MustMatch } from '../../_helpers/must-match.validator';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-reset-password',
  templateUrl: './admin-reset-password.component.html',
  styleUrls: ['./admin-reset-password.component.scss']
})
export class AdminResetPasswordComponent implements OnInit {
 AdminChangePasswordDetails!:  FormGroup
  submitted: any = false;
  personal_step = false;
	step = 1;	
  showOldPassword: boolean = false; 
  showNewPassword: boolean = false; 
  showConfirmPassword: boolean = false; 
	selectedPattern!: string;
  displayStyle = 'none';
  Email:any;
  message = '';
  constructor( private formBuilder: FormBuilder,
    private userService: UserService,
    private httpClientModule: HttpClientModule,
    private router: Router) { }
//     AdminChangePasswordDetails = this.formBuilder.group({
//       oldPassword: [null, [Validators.required]],
//       newPassword: [null, [Validators.required, Validators.minLength(8)]],
//       confirmPassword: new FormControl('', [Validators.required])

//    }, 
//    {
//     validator: MustMatch('newPassword', 'confirmPassword')
// } );
  ngOnInit(): void {
    this.AdminChangePasswordDetails = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required,Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$")]],
      confirmPassword: new FormControl('', [Validators.required])

   }, 
   {
    validator: MustMatch('newPassword', 'confirmPassword')
} );
  }

  get personal() {
		return this.AdminChangePasswordDetails.controls;
	}

  next() {
		if (this.step == 1) {
		  this.personal_step = true;
		  if (this.AdminChangePasswordDetails.invalid) {
			return;
		  }
		  this.step++;
		}
	}


	previous() {
		this.step--;
		if (this.step == 1) {
		  this.personal_step = false;
		}
	}
  changePasswordAdmin(){
       this.Email = localStorage.getItem('email');
    let params: any = {
      email:  this.Email, 
      oldPassword: this.AdminChangePasswordDetails.value.oldPassword,
      newPassword: this.AdminChangePasswordDetails.value.newPassword,
      confirmPassword: this.AdminChangePasswordDetails.value.confirmPassword,

    };
    this.userService.resetAdminPassword(params).subscribe(
      (res: any) => {
        console.log(res, 'under');
        if (res) {
           Swal.fire(res.msg);
          this.AdminChangePasswordDetails.reset();
          localStorage.removeItem('accesstoken');
          this.router.navigate(['/admin'])
        }
        
        this.displayStyle = 'block';
        this.message = '';
        this.submitted = true;
      },
      (err: any) => {
        this.displayStyle = 'block';
        this.message = err.error.message;
        Swal.fire(this.message);

      }
    );
  }
  showOldPass() {
    this.showOldPassword = !this.showOldPassword;
  
  }
  showNewPass() {
    this.showNewPassword = !this.showNewPassword;
  
  }
  showConfirmPass() {
    this.showConfirmPassword = !this.showConfirmPassword;
  
  }


}
