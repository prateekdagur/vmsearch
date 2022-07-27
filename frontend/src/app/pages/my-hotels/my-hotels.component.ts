import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { Router } from "@angular/router";
import { HttpClientModule }    from '@angular/common/http';
@Component({
  selector: 'app-my-hotels',
  templateUrl: './my-hotels.component.html',
  styleUrls: ['./my-hotels.component.scss']
})
export class MyHotelsComponent implements OnInit {
  data:any;
  hotelId:any;
  displayStyle = "none";
  message:any;

  constructor(private userService: UserService,private httpClientModule:HttpClientModule, private router:Router) { }
  

  ngOnInit(): void {
    this.userService.getMyHotels().subscribe(
      (res:any) =>{
        this.data = res;
      },
      (err:any)=>{
        
      }
    );
  }

  closePopup() {
		this.displayStyle = "none";
	}

  setHotelId(hotelId: number) {
    this.hotelId = hotelId; 
  }

  deleteHotel(){
    this.userService.deleteHotel(this.hotelId).subscribe(
      (res:any) =>{
       console.log(res);
       this.displayStyle = "block";
       this.message = "Hotel Deleted Successfully!";
       setTimeout(() => {
        window.location.reload();
        }, 2000);
      },
      (err:any)=>{
        console.log(err);
        this.displayStyle = "block";
				this.message = "Unable to  Delete Hotel. Please try again!";
      }
    );
  }

}
