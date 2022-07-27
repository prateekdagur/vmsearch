import { Component, OnInit,NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { HttpClientModule }    from '@angular/common/http';
import { Router } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import { dataService } from 'src/app/shared/dataservice.service';


@Component({
  selector: 'app-subscription-payment',
  templateUrl: './subscription-payment.component.html',
  styleUrls: ['./subscription-payment.component.scss']
})
export class SubscriptionPaymentComponent implements OnInit {
  formDetails!: FormGroup;
  stripeToken:any;
  displayStyle = "none";
  message = "";
  typeSelected: string;
  data:any;
  formSubmitAttempt = false;
  hotelSubscriptionId:any;

  constructor(private formBuilder: FormBuilder,private userService: UserService,private httpClientModule:HttpClientModule,private router:Router,private spinnerService: NgxSpinnerService,private zone: NgZone,private dataservice:dataService) {  this.typeSelected = 'ball-fussion';}

  ngOnInit(): void {

    this.data = this.dataservice.planId;

    console.log(this.data);
    this.hotelSubscriptionId = this.dataservice.hotelSubscriptionId;

    if(!this.data){
      this.router.navigateByUrl('/home/')
    }

    this.formDetails = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z ]*$')
      ]],
      cardnumber: ['',[Validators.required,Validators.maxLength(16),Validators.minLength(14),Validators.pattern("^[0-9]*$")]],
      mmyy: ['', [Validators.required,Validators.maxLength(6),Validators.pattern("^[0-9]*$")]],
      cvv: ['',[Validators.required,Validators.maxLength(4),Validators.pattern("^[0-9]*$")]],
    });
  }

  get getInput() {
		return this.formDetails.controls;
	}
  
  getCardToken(){
   //console.log(this.formDetails.value);
    this.formSubmitAttempt = true;
    if(this.formDetails.valid){
      const mm = this.formDetails.value.mmyy.substring(0, 2);
      const yy = this.formDetails.value.mmyy.slice(-2);
      this.spinnerService.show();
        (<any>window).Stripe.card.createToken({
          number: this.formDetails.value.cardnumber,
          exp_month: mm,
          exp_year: yy,
          cvc: this.formDetails.value.cvv,
        },(status:number,response:any)=>{
          console.log(response);
          this.stripeToken =response;
          this.zone.run(() => {
            this.makePayment();
          });
        
        })
     }
  }


  closePopup() {
		this.displayStyle = "none";
	}

  makePayment(){
    let response = this.stripeToken;
    let params:any = {
      "token":response.id,
      "name":this.formDetails.value.name,
      "hotelId":this.hotelSubscriptionId,
      "planId":this.data._id,
      "price":this.data.price
    }
    this.userService.makePayment(params).subscribe(
      (res:any) =>{     
        if(res.statusText == "err"){
          this.displayStyle = "block";
          this.message = 'Unable to make payment. Please check your card details!';   
        }else{
          this.displayStyle = "block";
          this.message = 'Payment Completed Successfully.';          
          setTimeout(() => {
              this.router.navigateByUrl('login');
          }, 2000);
        }
        this.spinnerService.hide();          
      },
      (err:any)=>{       
        this.displayStyle = "block";
        this.message = 'Unable to make payment. Please check your card details!';   
        this.spinnerService.hide();          
       
      }
    );
  }

}
