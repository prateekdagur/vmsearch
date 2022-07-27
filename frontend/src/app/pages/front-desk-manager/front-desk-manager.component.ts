import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from 'src/app/shared/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-front-desk-manager',
  templateUrl: './front-desk-manager.component.html',
  styleUrls: ['./front-desk-manager.component.scss']
})
export class FrontDeskManagerComponent implements OnInit {
  frontDeskList:any;
  dateFormat = environment.dateFormat;
  frontDeskId:any;
  displayStyle = "none";
  message:any;
  modalimage:any;

  constructor(private userService:UserService, private router:Router) { }

  ngOnInit(): void {
    this.userService.frontDeskList().subscribe(
      (res:any) =>{
        console.log(res);
        this.frontDeskList = res;
      }
    );
  }


  closePopup() {
		this.displayStyle = "none";
	}


  setFrontDeskId(frontDeskId) {
    this.frontDeskId = frontDeskId; 
  }

  deleteFrontdesk(){
    this.userService.deleteFrontdesk(this.frontDeskId).subscribe(
      (res:any) =>{
       
       this.displayStyle = "block";
       this.message = "Front Desk Manager Deleted Successfully!";
       this.modalimage = "../../../assets/image/check-modal.svg";
       setTimeout(() => {
        window.location.reload();
        }, 2000);
      },
      (err:any)=>{
       
        this.displayStyle = "block";
				this.message = "Unable to  Delete Front Desk Manager. Please try again!";
        this.modalimage = "../../../assets/image/error-modal.svg";
      }
    );
  }


}
