import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit {
  displayStyle = 'none';
  message = '';
  p:number = 1;
  itemsperPage: number = 10
  adminViewUser!: FormGroup;
  viewData: any;
  pageSize: number = 10;
  phoneForm!: FormGroup
  array1: any = [];
  userData: any = [];
  testData: any = [];
  userCount: any = [];
  AdminUserView: any;
  startStatus: any = "ALL"
  email:any = ""
  number:any = ""
  rejectUserId: any
  acceptUserId: any
  deleteUserId: any
  // count:any = []
  countelement: any = [];
  totalLength: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private httpClientModule: HttpClientModule,
    private router: Router
  ) {}
  // oppoSuitsForm = this.formBuilder.group({
  //   name: ['', [Validators.required]],
  // });
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
	PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  phone = '';
	changePreferredCountries() {
		this.preferredCountries = [CountryISO.UnitedStates];
	}
  ngOnInit(): void {
  this.getUsers(this.startStatus);
  console.log(this.userData, 'final');
//   this.phoneForm = this.formBuilder.group({
//     phone: [''],
//  }) 
}


  getUsers(status) {
    this.userService.getAdminUsers(status).subscribe(
      (response: any) => {
        console.log(response['users'], 'usertype111111111111>>>>>>>>>>>');
        if(response['users'].length > 0){
          this.userData = response['users']
          // for(let i=0; i < response['users'].length; i++){
          //   console.log( response['users'][i].user_type, "userssssssssssssssssssss>>>>>>>>>>>>")
          //   if(response['users'][i].user_type === "HOTEL_OWNER"){
          //     this.userData.push(response['users'][i]);
          //   }
           
            // this.userData = response['users'];
            // this.totalLength = response['users'].length;
            // console.log(this.totalLength, 'ddddddd');
         // }
          this.totalLength = this.userData.length;
        } else {
          this.userData = []
          this.totalLength = this.userData.length;

        }
        //this.testData = response['users']
       
      },
      (err: any) => {
        this.displayStyle = 'block';
        this.message = err.error.message;
      }
    );
  }


// getUserByStatus(state){
//   this.userService
//     .getAdminUserByStatus(state)
//     .subscribe((response: any) => {
//       console.log(response['users'], "userfirst>>>>>>>>>>>>")
//       if( response['users'].length > 0){
//         this.userData = []
//         for(let i=0; i < response['users'].length; i++){
//           //console.log( response['users'][i].user_type, "userssssssssssssssssssss>>>>>>>>>>>>")
//           if(response['users'][i].user_type === "HOTEL_OWNER"){
//             this.userData.push(response['users'][i]);
//           }
         
//           // this.userData = response['users'];
//           // this.totalLength = response['users'].length;
//           // console.log(this.totalLength, 'ddddddd');
//         }
//         this.totalLength = this.userData.length;
//       }
      
      
//     },
//     (err: any) => {
//       this.displayStyle = 'block';
//       this.message = err.error.message;
//     });
// }


  pageChangeEvent(event: number) {
    this.p = event;
    this.getUsers(this.startStatus);
  }

  // sudo sysctl -w fs.inotify.max_user_watches=524288
  // sudo service mongod start
  // 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
check(e){
  console.log(e.target.value)
   this.startStatus = e.target.value
 // if(this.startStatus === "ALL"){
    this.getUsers(this.startStatus)
  // } else {
  //   console.log("222222222222")
  //   this.getUserByStatus(this.startStatus)
  // }
  
}

onChangeEmail(e){
console.log(e.target.value, "wwwwwwwwwwwwwwwwwwwwwwwwww")
this.email = e.target.value
  this.userService
    .getAdminUserByEmail(this.email)
    .subscribe((response: any) => {
      console.log(response['users'], "userfirst>>>>>>>>>>>>")
      if(response['users'].length > 0){
        this.userData = response['users']
        // for(let i=0; i < response['users'].length; i++){
        //   console.log( response['users'][i].user_type, "userssssssssssssssssssss>>>>>>>>>>>>")
        //   if(response['users'][i].user_type === "HOTEL_OWNER"){
        //     this.userData.push(response['users'][i]);
        //   }
         
          // this.userData = response['users'];
          // this.totalLength = response['users'].length;
          // console.log(this.totalLength, 'ddddddd');
       // }
        this.totalLength = this.userData.length;
      } else {
        this.userData = []
        this.totalLength = this.userData.length;

      }
      
      
    },
    (err: any) => {
      this.displayStyle = 'block';
      this.message = err.error.message;
    });
}

onChangeNumber(e){
  this.number = e.target.value
  console.log(this.number, "nnnnnnnnnnnnnnn")
  console.log(this.number, "number11111")
//   if(this.number.length === 3){
//     this.number = `(${this.number})`
//   console.log(this.number, "number22222")

//   } else if(this.number.length > 3 && this.number.length < 7){
//   console.log("eeeeeeeee")
//       this.number = `(${this.number.slice(0, 3)}) ${this.number.slice(3, 6)}`
//     console.log(this.number, "number333333333")
//   }
//   else if(this.number.length > 6 && this.number.length < 11){
//   console.log("ffffffffff")
//       this.number = `(${this.number.slice(0, 3)}) ${this.number.slice(3, 6)}${-this.number.slice(6, 10)}`
//     console.log(this.number, "number4444444444")
// }

    this.userService
      .getAdminUserByNumber(this.number)
      .subscribe((response: any) => {
        console.log(response['users'], "userfirst>>>>>>>>>>>>")
        if(response['users'].length > 0){
          this.userData = response['users']
          // for(let i=0; i < response['users'].length; i++){
          //   console.log( response['users'][i].user_type, "userssssssssssssssssssss>>>>>>>>>>>>")
          //   if(response['users'][i].user_type === "HOTEL_OWNER"){
          //     this.userData.push(response['users'][i]);
          //   }
           
            // this.userData = response['users'];
            // this.totalLength = response['users'].length;
            // console.log(this.totalLength, 'ddddddd');
         // }
          this.totalLength = this.userData.length;
        } else {
          this.userData = []
          this.totalLength = this.userData.length;
  
        }
        
        
      },
      (err: any) => {
        this.displayStyle = 'block';
        this.message = err.error.message;
      });
  }



//getAdminUserByName

  statusChange(id) {
  
   let  status = 'APPROVED';
    let params: any = {
      is_approved: status,
    };
    //this.utilsService.processPatchRequest('tutor/update/' + id, { tutor_profile_status: status}).pipe(takeUntil(this.destroy$)).subscribe((response)
    this.userService
      .updateUsersStatus(params, id)
      .subscribe((response: any) => {
        this.getUsers(this.startStatus);
      });
    // this.userService.updateHotelStatus(params, id).subscribe(
    //   (response:any) =>{

    //   },
    // );
  }

  softDeleteUser(id) {
  
    let  status = false;
     let params: any = {
      deleteStatus: status,
     };
     this.userService
       .updateAdminUserDeleteStatus(params, id)
       .subscribe((response: any) => {
         this.getUsers(this.startStatus);
       });
     
   }


rejectUser(id) {
    let params: any = {
      is_approved: 'REJECTED',
    };
    this.userService
      .updateUsersStatus(params, id)
      .subscribe((response: any) => {
        this.getUsers(this.startStatus);
      });
  }
  acceptId(id){
    this.acceptUserId = id
  }
  rejectId(id){
   this.rejectUserId = id
 }
 deleteId(id){
  this.deleteUserId = id
}
 
}
