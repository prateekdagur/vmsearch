import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-hotels',
  templateUrl: './admin-hotels.component.html',
  styleUrls: ['./admin-hotels.component.scss'],
})
export class AdminHotelsComponent implements OnInit {
  displayStyle = 'none';
  message = '';
  p:number = 1;
  itemsperPage:number = 10
  pageSize: number = 8;
  totalItem: any;
  hotelData: any = [];
  startStatus: any = "ALL"
  email:any = ""
  name:any = ""
  number:any = ""
  address:any = ""
  accepthotelId: any;
  rejecthotelId: any;
  deletehotelId:any;
  constructor(
    private userService: UserService,
    private httpClientModule: HttpClientModule,
    private router: Router
  ) {}
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
	PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
	changePreferredCountries() {
		this.preferredCountries = [CountryISO.UnitedStates];
	}
  ngOnInit(): void {
    console.log("checkkkkkkkkkkkkkkkkkkkkkkk")
    this.getHotel(this.startStatus);
  }

  getHotel(status) {
    console.log(status, "00000000000000000")
    this.userService.getAdminHotels(status).subscribe(
      (response: any) => {
        this.hotelData = response;
        console.log(this.hotelData, "hhhhhhhhhhhhhhh")
        this.totalItem = this.hotelData.length;
      },
      (err: any) => {
        this.displayStyle = 'block';
        this.message = err.error.message;
      }
    );
  }

  check(e){
    console.log(e.target.value)
     this.startStatus = e.target.value
   // if(this.startStatus === "ALL"){
      this.getHotel(this.startStatus)
    // } else {
    //   console.log("222222222222")
    //   this.getUserByStatus(this.startStatus)
    // }
    
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getHotel(this.startStatus);
  }

  onChangeEmail(e){
    console.log(e, "wwwwwwwwwwwwwwwwwwwwwwwwww")
    this.email = e.target.value
      this.userService
        .getAdminHotelByEmail(this.email)
        .subscribe((response: any) => {
          console.log(response, "userfirst>>>>>>>>>>>>")
          if(response.length > 0){
            this.hotelData = response
            this.totalItem = this.hotelData.length;
          } else {
            this.hotelData = []
            this.totalItem = this.hotelData.length;
    
          }
          
          
        },
        (err: any) => {
          this.displayStyle = 'block';
          this.message = err.error.message;
        });
    }
    
    onChangeName(e){
      console.log(e.target.value, "name11111111111")
      this.name = e.target.value
        this.userService
          .getAdminHotelByName(this.name)
          .subscribe((response: any) => {
            console.log(response, "nameeeeeeeeeee>>>>>>>>>>>>")
            if(response.length > 0){
              this.hotelData = response
              this.totalItem = this.hotelData.length;
            } else {
              this.hotelData = []
              this.totalItem = this.hotelData.length;
      
            }
            
            
          },
          (err: any) => {
            this.displayStyle = 'block';
            this.message = err.error.message;
          });
      }

      onChangeAddress(e){
        console.log(e.target.value, "name11111111111")
        this.address = e.target.value
          this.userService
            .getAdminHotelByAddress(this.address)
            .subscribe((response: any) => {
              console.log(response, "nameeeeeeeeeee>>>>>>>>>>>>")
              if(response.length > 0){
                this.hotelData = response
                this.totalItem = this.hotelData.length;
              } else {
                this.hotelData = []
                this.totalItem = this.hotelData.length;
        
              }  
            },
            (err: any) => {
              this.displayStyle = 'block';
              this.message = err.error.message;
            });
        }




    onChangeNumber(e){
      this.number = e.target.value
      console.log(this.number, "number11111")
      if(this.number.length === 3){
        this.number = `(${this.number})`
      console.log(this.number, "number22222")
    
      } else if(this.number.length > 3 && this.number.length < 7){
      console.log("eeeeeeeee")
          this.number = `(${this.number.slice(0, 3)})${this.number.slice(3, 6)}`
        console.log(this.number, "number333333333")
      }
      else if(this.number.length > 6 && this.number.length < 11){
      console.log("ffffffffff")
          this.number = `(${this.number.slice(0, 3)}) ${this.number.slice(3, 6)}${-this.number.slice(6, 10)}`
        console.log(this.number, "number4444444444")
    }
    
        this.userService
          .getAdminHotelByNumber(this.number)
          .subscribe((response: any) => {
            console.log(response, "hotel>>>>>>>>>>>>")
            if(response.length > 0){
              this.hotelData = response
              // for(let i=0; i < response['users'].length; i++){
              //   console.log( response['users'][i].user_type, "userssssssssssssssssssss>>>>>>>>>>>>")
              //   if(response['users'][i].user_type === "HOTEL_OWNER"){
              //     this.userData.push(response['users'][i]);
              //   }
               
                // this.userData = response['users'];
                // this.totalLength = response['users'].length;
                // console.log(this.totalLength, 'ddddddd');
             // }
              this.totalItem = this.hotelData.length;
            } else {
              this.hotelData = []
              this.totalItem = this.hotelData.length;
      
            }
            
            
          },
          (err: any) => {
            this.displayStyle = 'block';
            this.message = err.error.message;
          });
      }
      onChangeZip(e){
        this.number = e.target.value
        console.log(this.number, "number11111")
          this.userService
            .getAdminHotelByZip(this.number)
            .subscribe((response: any) => {
              console.log(response, "hotel>>>>>>>>>>>>")
              if(response.length > 0){
                this.hotelData = response
                this.totalItem = this.hotelData.length;
              } else {
                this.hotelData = []
                this.totalItem = this.hotelData.length;
        
              }
              
              
            },
            (err: any) => {
              this.displayStyle = 'block';
              this.message = err.error.message;
            });
        }




      getAdminHotelByZip



  statusChange(id) {
    let status = 'APPROVED';
    let params: any = {
      is_approved: status,
    };
    //this.utilsService.processPatchRequest('tutor/update/' + id, { tutor_profile_status: status}).pipe(takeUntil(this.destroy$)).subscribe((response)
    this.userService
      .updateHotelStatus(params, id)
      .subscribe((response: any) => {
        this.getHotel(this.startStatus);
      });
  }

  softDeleteHotel(id) {
    let status = false;
    let params: any = {
      deleteStatus: status,
    };
    this.userService
      .updateAdminHotelDeleteStatus(params, id)
      .subscribe((response: any) => {
        this.getHotel(this.startStatus);
      });
  }

  rejectHotel(id) {
    let params: any = {
      is_approved: 'REJECTED',
    };
    this.userService
      .updateHotelStatus(params, id)
      .subscribe((response: any) => {
        this.getHotel(this.startStatus);
      });
  }
  acceptId(id){
    console.log(id, "iddddddddd")
    this.accepthotelId = id
  }
  rejectId(id){
   console.log(id, "iddddddddd")
   this.rejecthotelId = id
 }
 deleteId(id){
  console.log(id, "iddddddddd")
  this.deletehotelId = id
}

}
