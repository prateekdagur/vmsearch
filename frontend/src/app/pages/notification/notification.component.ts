import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from 'src/app/shared/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  dataArray:any;
  hotelData:any;
  totalItems : any;
  canEdit:any;
  dateFormat = environment.dateFormat;
  page:number =0;
  constructor(private userService:UserService, private router:Router) { }

  ngOnInit(): void {
    

    this.userService.notificationList(this.page).subscribe(
      (res:any) =>{
            
            if(res.statusText == "success"){   
              const count:any = res.data.length;
              for (let i = 0; i < count; i++) {                
                this.userService.getHotelDetails(res.data[i].eventData.hotelId).subscribe(
                  (result:any) =>{   

                      res.data[i].eventData['hotelname'] = result.hotelname;
                      res.data[i].eventData['hotelstate'] = result.state;
                      let imageCount = 0;                      
                      if(res.data[i].eventData.photos){
                         imageCount = JSON.parse(res.data[i].eventData.photos).length;
                      }
                      let videoCount = 0;
                      if(res.data[i].eventData.videos){
                         videoCount = JSON.parse(res.data[i].eventData.videos).length;
                      }
                      res.data[i].eventData['allCount'] = imageCount + videoCount;  
                      
                      let dnrReason = [];
                      if(res.data[i].eventData.dnrReason){
                        res.data[i].eventData['dnrReason'] = JSON.parse(res.data[i].eventData.dnrReason);
                      }


                  })  
              }
              this.totalItems = res.totalData;
              this.dataArray = res.data;
              
           }
       })

       this.userService.readNotificationUpdate().subscribe(
        (res:any) =>{
      });
   }

   pageChange(page: number) {
		this.page = page;
    let page_num = page-1;
    this.userService.notificationList(page_num).subscribe(
      (res:any) =>{
            console.log(res);
            if(res.statusText == "success"){   
              const count:any = res.data.length;
              for (let i = 0; i < count; i++) {                
                this.userService.getHotelDetails(res.data[i].eventData.hotelId).subscribe(
                  (result:any) =>{                   
                      res.data[i].eventData['hotelname'] = result.hotelname;
                      res.data[i].eventData['hotelstate'] = result.state;
                      let imageCount = 0;                      
                      if(res.data[i].eventData.photos){
                         imageCount = JSON.parse(res.data[i].eventData.photos).length;
                      }
                      let videoCount = 0;
                      if(res.data[i].eventData.videos){
                         videoCount = JSON.parse(res.data[i].eventData.videos).length;
                      }
                      res.data[i].eventData['allCount'] = imageCount + videoCount;                                    
                  })  
              }
              this.totalItems = res.totalData;
              this.dataArray = res.data;
              console.log(this.dataArray);
           }
       })
	}
}
