import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { HttpClientModule }    from '@angular/common/http';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';
 
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
//   AdminLoginDetails!: FormGroup;
AdminLoginDetails = new FormGroup({
	email: new FormControl(''),
	password: new FormControl('')
})
  displayStyle = "none";
  message = "";

  constructor(private formBuilder: FormBuilder,private userService: UserService,private httpClientModule:HttpClientModule,private router:Router) { }

  ngOnInit(): void {
		console.log("outside if block")
        if(this.userService.isAdminLoggedIn()){
		console.log("inside if block")
			this.router.navigate(['admin-users']);
		}

   		 this.AdminLoginDetails = this.formBuilder.group({
		  email: ['', [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
		  password: ['', Validators.required]
		});
  }

  get getLogin() {
		return this.AdminLoginDetails.controls;
	}

	logins(){
		let params:any = {		
			'email':this.AdminLoginDetails.value.email,			
			'password':this.AdminLoginDetails.value.password
		}
		this.userService.loginAdmin(params).subscribe(
			(res:any) =>{
                console.log(res, "response>>>>>>>>>>>>>>>>>>>")
        		this.userService.setAdminToken(res['accesstoken']);
				this.userService.setAdminEmail(res['email'])
				// if(res['accesstoken']){
				// 	Swal.fire('You Are logged in Successfully');	
				// } 
				this.displayStyle = "block";
				this.message = "Admin Logged in Success";
				if(this.userService.getAdminToken()){
					this.router.navigateByUrl('admin-users');
				} else {
					this.router.navigateByUrl('admin');
				}
        		
			},
			(err:any)=>{
				this.displayStyle = "block";
				this.message = err.error.message;
				Swal.fire(this.message);	
			}
		);
		
	}


  closePopup() {
		this.displayStyle = "none";
	}

}
