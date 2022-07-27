import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { HttpClientModule, }    from '@angular/common/http';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-frontdesk-contact-us',
  templateUrl: './frontdesk-contact-us.component.html',
  styleUrls: ['./frontdesk-contact-us.component.scss']
})
export class FrontdeskContactUsComponent implements OnInit {

  contactForm!: FormGroup;
  displayStyle = "none";
  message = "";
  formSubmitAttempt:boolean=false;
  data:any;

  constructor(private formBuilder: FormBuilder,private userService: UserService,private httpClientModule:HttpClientModule, private router:Router, private spinnerService:NgxSpinnerService) { }

    ngOnInit(): void {
      this.contactForm = this.formBuilder.group({
        heading: ['', [Validators.required]],
        message: ['', [Validators.required]]
    })
  }


  get getInput() {
		return this.contactForm.controls;
	}


  submit(){
    this.formSubmitAttempt = true;
    if(this.contactForm.valid){
      this.spinnerService.show();
        let params:any = {		
          'heading':this.contactForm.value.heading,
          'message':this.contactForm.value.message
        }

        this.userService.sendContactInfo(params).subscribe(
          (res:any) =>{
            this.spinnerService.hide();
            this.displayStyle = "block";
            this.message = res.message;  
            setTimeout(() => {
              window.location.reload();        
            }, 2000);            
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

}
