import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { HttpClientModule }    from '@angular/common/http';
import { Router } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-front-desk-manager',
  templateUrl: './add-front-desk-manager.component.html',
  styleUrls: ['./add-front-desk-manager.component.scss']
})
export class AddFrontDeskManagerComponent implements OnInit {

  hotels:any;
  formDetails!: FormGroup;
  displayStyle="none";
  message:any;
  modalimage:any;

  passwordType='password';
  passwordImage = 'eye.svg';
  dispalyPasswordTypeEyeClose = "none";
  dispalyPasswordTypeEye = "Block";
  
  formSubmitAttempt:boolean = false;
  constructor(private formBuilder: FormBuilder,private userService: UserService,private httpClientModule:HttpClientModule, private router:Router, private spinnerService:NgxSpinnerService) { }

  ngOnInit(): void {

    
    this.userService.getActiveHotels().subscribe(
      (res:any) =>{
        this.hotels = res;
      }
    );


    
    this.formDetails = this.formBuilder.group({        
      frontDeskHotelId: ['',Validators.required],
      frontDeskFullName :  ['',[
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z ]*$')
        ]],
      frontDeskUserName:['',[Validators.required,Validators.pattern("^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$")]],
      frontDeskPosition:['',Validators.required],
      frontDeskEmpSince:['',Validators.required],
      password: ['', [Validators.required,Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$")]],
    });

  }


  get getInput() {
		return this.formDetails.controls;
	}

  closePopup() {
		this.displayStyle = "none";
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

  submit() {   
    this.formSubmitAttempt = true;
    if(this.formDetails.valid){   
      let params:any = {  
        'frontDeskHotelId':   this.formDetails.value.frontDeskHotelId,   
        'frontDeskFullName':this.formDetails.value.frontDeskFullName,
        'frontDeskUserName':this.formDetails.value.frontDeskUserName,
        'frontDeskPosition':this.formDetails.value.frontDeskPosition,
        'frontDeskEmpSince':this.formDetails.value.frontDeskEmpSince,
        'password':this.formDetails.value.password,       	
      }
      
      console.log(params);
      
     this.userService.addFrontDeskManager(params).subscribe(
        (res:any) =>{ 
          console.log(res);
          
          this.message = res.message;
          if(res.statusText == "success"){
            this.modalimage = "../../../assets/image/check-modal.svg";
            setTimeout(() => {
              this.router.navigate(['front-desk-manager']);
            }, 2000);
          }else{
            this.modalimage = "../../../assets/image/error-modal.svg";
          }

          this.displayStyle = "block";
        },
        (err:any)=>{
          this.displayStyle = "block";
          this.message = err.error;
        }
      );
    }
  }

}
