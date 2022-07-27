import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { HttpClientModule }    from '@angular/common/http';
import { Router ,ActivatedRoute} from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-front-desk-manager',
  templateUrl: './edit-front-desk-manager.component.html',
  styleUrls: ['./edit-front-desk-manager.component.scss']
})
export class EditFrontDeskManagerComponent implements OnInit {

  id:any;
  hotels:any;
  currentHotelId:any;
  formDetails!: FormGroup;
  displayStyle="none";
  message:any;
  modalimage:any;
  data:any;

  formSubmitAttempt:boolean = false;
  constructor(private formBuilder: FormBuilder,private userService: UserService,private httpClientModule:HttpClientModule, private router:Router,private route: ActivatedRoute,private ngxSpinnerService:NgxSpinnerService) {}		


  ngOnInit(): void {
    
    this.route.params.subscribe(params => {
			this.id = params['id'];
		});
    
    this.userService.getActiveHotels().subscribe(
      (res:any) =>{
        this.hotels = res;
      }
    );

    
    this.formDetails = this.formBuilder.group({        
      frontDeskHotelId: ['',Validators.required],
      frontDeskFullName :  ['',Validators.required],
      frontDeskUserName:['',[Validators.required,Validators.pattern("^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$")]],
      frontDeskPosition:['',Validators.required],
      frontDeskEmpSince:['',Validators.required],
      password: ['', [Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$")]],
    });



    this.userService.getFrontDeskDetails(this.id).subscribe(
      (res:any) =>{  
        this.currentHotelId = res.data.frontDeskHotelId;
       
        this.formDetails.patchValue({
          frontDeskHotelId: res.data.frontDeskHotelId,
          frontDeskFullName: res.data.frontDeskFullName,
          frontDeskPosition: res.data.frontDeskPosition,
          frontDeskEmpSince: res.data.frontDeskEmpSince,
          frontDeskUserName: res.data.frontDeskUserName,
        });

        console.log(res);
	  },
     (err:any)=>{
      
      }
    );

  }


  get getInput() {
		return this.formDetails.controls;
	}

  closePopup() {
		this.displayStyle = "none";
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
      
     this.userService.editFrontDeskManager(params,this.id).subscribe(
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
