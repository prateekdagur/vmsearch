import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from 'src/app/shared/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-frontdesk-manager',
  templateUrl: './admin-frontdesk-manager.component.html',
  styleUrls: ['./admin-frontdesk-manager.component.scss']
})
export class AdminFrontdeskManagerComponent implements OnInit {
  frontDeskList:any;
  dateFormat = environment.dateFormat;
  frontDeskId:any;
  displayStyle = "none";
  p:number = 1;
  name:any = ""
  hotelName:any = ""
  userName:any = ""
  position:any = ""
  empSince:any = ""
  deleteFrontDeskManId:any
  itemsperPage: number = 10
  totalItem: any;
  message:any;
  modalimage:any;

  constructor(private userService:UserService, private router:Router) { }

  ngOnInit(): void {
   this.getFrontManager()
  }
  getFrontManager(){
    this.userService.adminFrontDeskList().subscribe(
      (res:any) =>{
        this.frontDeskList = res;
      }
    );
  }

  closePopup() {
		this.displayStyle = "none";
	}


  // setFrontDeskId(frontDeskId) {
  //   this.frontDeskId = frontDeskId; 
  // }

  // deleteFrontdesk(){
  //   this.userService.deleteFrontdesk(this.frontDeskId).subscribe(
  //     (res:any) =>{
       
  //      this.displayStyle = "block";
  //      this.message = "Front Desk Manager Deleted Successfully!";
  //      this.modalimage = "../../../assets/image/check-modal.svg";
  //      setTimeout(() => {
  //       window.location.reload();
  //       }, 2000);
  //     },
  //     (err:any)=>{
       
  //       this.displayStyle = "block";
	// 			this.message = "Unable to  Delete Front Desk Manager. Please try again!";
  //       this.modalimage = "../../../assets/image/error-modal.svg";
  //     }
  //   );
  // }

  onChangeName(e){
    console.log(e.target.value, "name11111111111")
    this.name = e.target.value
      this.userService
        .getAdminFrontDeskByName(this.name)
        .subscribe((response: any) => {
          console.log(response, "nameeeeeeeeeee>>>>>>>>>>>>")
          if(response.length > 0){
            this.frontDeskList = response
            this.totalItem = this.frontDeskList.length;
          } else {
            this.frontDeskList = []
            this.totalItem = this.frontDeskList.length;
    
          }
          
          
        },
        (err: any) => {
          this.displayStyle = 'block';
          this.message = err.error.message;
        });
  }

  onChangeHotelName(e){
    console.log(e.target.value, "name11111111111")
    this.hotelName = e.target.value
      this.userService
        .getAdminFrontDeskByHotelName(this.hotelName)
        .subscribe((response: any) => {
          console.log(response, "nameeeeeeeeeee>>>>>>>>>>>>")
          if(response.length > 0){
            this.frontDeskList = response
            this.totalItem = this.frontDeskList.length;
          } else {
            this.frontDeskList = []
            this.totalItem = this.frontDeskList.length;
    
          }
          
          
        },
        (err: any) => {
          this.displayStyle = 'block';
          this.message = err.error.message;
        });
  }
  onChangeUserName(e){
    console.log(e.target.value, "name11111111111")
    this.userName = e.target.value
      this.userService
        .getAdminFrontDeskByUserName(this.userName)
        .subscribe((response: any) => {
          console.log(response, "nameeeeeeeeeee>>>>>>>>>>>>")
          if(response.length > 0){
            this.frontDeskList = response
            this.totalItem = this.frontDeskList.length;
          } else {
            this.frontDeskList = []
            this.totalItem = this.frontDeskList.length;
    
          }
          
          
        },
        (err: any) => {
          this.displayStyle = 'block';
          this.message = err.error.message;
        });
      }
      onChangePosition(e){
        console.log(e.target.value, "name11111111111")
        this.position = e.target.value
          this.userService
            .getAdminFrontDeskByPosition(this.position)
            .subscribe((response: any) => {
              console.log(response, "nameeeeeeeeeee>>>>>>>>>>>>")
              if(response.length > 0){
                this.frontDeskList = response
                this.totalItem = this.frontDeskList.length;
              } else {
                this.frontDeskList = []
                this.totalItem = this.frontDeskList.length;
        
              }
              
              
            },
            (err: any) => {
              this.displayStyle = 'block';
              this.message = err.error.message;
            });
          }
          onChangeEmpSince(e){
            console.log(e.target.value, "name11111111111")
            this.empSince = e.target.value
              this.userService
                .getAdminFrontDeskByEmpSince(this.empSince)
                .subscribe((response: any) => {
                  console.log(response, "nameeeeeeeeeee>>>>>>>>>>>>")
                  if(response.length > 0){
                    this.frontDeskList = response
                    this.totalItem = this.frontDeskList.length;
                  } else {
                    this.frontDeskList = []
                    this.totalItem = this.frontDeskList.length;
            
                  }
                  
                  
                },
                (err: any) => {
                  this.displayStyle = 'block';
                  this.message = err.error.message;
                });
          }


        softDeleteFrontendDeskMan(id) {
            let status = false;
            let params: any = {
              deleteStatus: status,
            };
            this.userService
              .updateAdminFrontDeskManDeleteStatus(params, id)
              .subscribe((response: any) => {
                this.getFrontManager();
              });
          }
  pageChangeEvent(event: number) {
    console.log(event, "eeeeeeeeeeee")
    this.p = event;
    this.getFrontManager();
  }
  deleteId(id){
    console.log(id, "iddddddddd")
    this.deleteFrontDeskManId = id
  }

}
