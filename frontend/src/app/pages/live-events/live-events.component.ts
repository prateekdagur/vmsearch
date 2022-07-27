import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from 'src/app/shared/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-live-events',
  templateUrl: './live-events.component.html',
  styleUrls: ['./live-events.component.scss']
})
export class LiveEventsComponent implements OnInit {
  dataArray:any;
  hotelData:any;
  totalItems : any;
  canEdit:any;
  dateFormat = environment.dateFormat;
  page:number =0;
  constructor(private userService:UserService, private router:Router) { }

  ngOnInit(): void {
    
    this.userService.liveEventList(this.page).subscribe(
      (resLiveEvent:any) =>{
       
            if(resLiveEvent.statusText == "success"){   
              const count:any = resLiveEvent.data.length;
              for (let i = 0; i < count; i++) {                
                this.userService.getHotelDetails(resLiveEvent.data[i].eventData.hotelId).subscribe(
                  (result:any) =>{   
                    
                    resLiveEvent.data[i].eventData['hotelname'] = result.hotelname;
                    resLiveEvent.data[i].eventData['hotelstate'] = result.state;
                      let imageCount = 0;                      
                      if(resLiveEvent.data[i].eventData.photos){
                         imageCount = JSON.parse(resLiveEvent.data[i].eventData.photos).length;
                      }
                      let videoCount = 0;
                      if(resLiveEvent.data[i].eventData.videos){
                         videoCount = JSON.parse(resLiveEvent.data[i].eventData.videos).length;
                      }
                      resLiveEvent.data[i].eventData['allCount'] = imageCount + videoCount;  
                      
                      let dnrReason = [];
                      if(resLiveEvent.data[i].eventData.dnrReason){
                        resLiveEvent.data[i].eventData['dnrReason'] = JSON.parse(resLiveEvent.data[i].eventData.dnrReason);
                      }
                  })  
              }
              this.totalItems = resLiveEvent.totalData;
              this.dataArray = resLiveEvent.data;
              console.log(this.dataArray);
           }
           
       })
   }

   pageChange(page: number) {
		this.page = page;
    let page_num = page-1;
    this.userService.liveEventList(page_num).subscribe(
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
