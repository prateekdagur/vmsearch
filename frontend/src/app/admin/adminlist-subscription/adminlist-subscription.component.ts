import { Component, OnInit } from '@angular/core';
//import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminlist-subscription',
  templateUrl: './adminlist-subscription.component.html',
  styleUrls: ['./adminlist-subscription.component.scss'],
})
export class AdminlistSubscriptionComponent implements OnInit {
  displayStyle = 'none';
  message = '';
  getSubscription: any;
  getbenefits: any = [];
  p:number = 1;
  itemsperPage: number = 10
  pageSize: number = 10;
  UpdateSubsId:any
  DeletednrId:any
  totalItem: any;
  title:any = ""
  month:any = ""
  benefitTitle:any = ""
  constructor(
    private userService: UserService,
    private httpClientModule: HttpClientModule,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getsubscription();
  }

  getsubscription() {
    this.userService.getAdminSubscription().subscribe((response) => {
      this.getSubscription = response;
      this.totalItem = this.getSubscription.length;
      console.log(this.getSubscription, 'dddddddddd');
    });
  }
  updateSubs(id){
    console.log(id, "uuuuuuuuuuuuuuuuuuuuu")
    this.UpdateSubsId = id
  }

  onChangeSubsTitle(e){
    console.log(e.target.value)
    this.title = e.target.value
      this.userService
        .getAdminSubscriptionByTitle(this.title)
        .subscribe((response: any) => {
         // console.log(response, "nameeeeeeeeeee>>>>>>>>>>>>")
          if(response.length > 0){
            this.getSubscription = response
            this.totalItem = this.getSubscription.length;
          } else {
            this.getSubscription = []
            this.totalItem = this.getSubscription.length;
    
          }  
        },
        (err: any) => {
          this.displayStyle = 'block';
          this.message = err.error.message;
        });
    }

    onChangeMonth(e){
      console.log(e.target.value, "name11111111111")
      this.month = e.target.value
        this.userService
          .getAdminSubscriptionByMonth(this.month)
          .subscribe((response: any) => {
            console.log(response, "nameeeeeeeeeee>>>>>>>>>>>>")
            if(response.length > 0){
              this.getSubscription = response
              this.totalItem = this.getSubscription.length;
            } else {
              this.getSubscription = []
              this.totalItem = this.getSubscription.length;
      
            }  
          },
          (err: any) => {
            this.displayStyle = 'block';
            this.message = err.error.message;
          });
      }

      onChangeBenefitTitle(e){
        console.log(e.target.value, "name11111111111")
        this.benefitTitle = e.target.value
          this.userService
            .getAdminSubscriptionByBenefitTitle(this.benefitTitle)
            .subscribe((response: any) => {
              console.log(response, "nameeeeeeeeeee>>>>>>>>>>>>")
              if(response.length > 0){
                this.getSubscription = response
                this.totalItem = this.getSubscription.length;
              } else {
                this.getSubscription = []
                this.totalItem = this.getSubscription.length;
        
              }  
            },
            (err: any) => {
              this.displayStyle = 'block';
              this.message = err.error.message;
            });
        }
        deleteSubs(id){
          console.log(id, "iddddddddddddd111111111>>>>>>>>>>>>>")
          this.userService.deleteAdminSubs(id).subscribe(
            (response:any) =>{
              this.getsubscription() 
                      },
          );
         }

        delete(id){
          console.log(id, "iddddddddd")
          this.DeletednrId = id
        }





  pageChangeEvent(event: number) {
    console.log(event, "eeeeeeeeeeee")
    this.p = event;
    this.getsubscription();
  }
}
