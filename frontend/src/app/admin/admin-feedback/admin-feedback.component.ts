import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-admin-feedback',
  templateUrl: './admin-feedback.component.html',
  styleUrls: ['./admin-feedback.component.scss'],
})
export class AdminFeedbackComponent implements OnInit {
  displayStyle = "none";
  message = "";
  DeletefeedId:any;
  UpdatednrId:any;
  dataArray:any;
  hotelData:any;
  totalItems : any;
  canEdit:any;
  dateFormat = environment.dateFormat;
  page:number = 0;
  p:number = 1;
 itemsperPage:number = 10;
 name:any = ""
 hotelName:any = ""
  constructor(private userService:UserService, private router:Router) { }

  ngOnInit(): void {
   this.getLiveEvents()
   }

   getLiveEvents(){
    this.userService.getAdminliveEventList().subscribe(
      (resLiveEvent:any) =>{
            
        console.log("liveEventList>>>>>>>>>>>>>>>>>>",resLiveEvent);
            if(resLiveEvent.statusText == "success"){   
              const count:any = resLiveEvent.data.length;
              console.log(count, "cccccccccccc>>>>>>>>>>>>")
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
                        //dnrReason = resLiveEvent.data[i].eventData['dnrReason']
                      }
                  })
              }
              this.totalItems = resLiveEvent.totalData;
              this.dataArray = resLiveEvent.data;
              console.log(this.dataArray, "2222222222222");
           } else {
            console.log("kkkkkkkkkkkkkk");
            this.dataArray = []

           }
       })
   }
  //  pageChange(page: number) {
	// 	this.page = page;
  //   let page_num = page-1;
  //   this.userService.liveEventList(page_num).subscribe(
  //     (res:any) =>{
  //           console.log(res);
  //           if(res.statusText == "success"){   
  //             const count:any = res.data.length;
  //             for (let i = 0; i < count; i++) {                
  //               this.userService.getHotelDetails(res.data[i].eventData.hotelId).subscribe(
  //                 (result:any) =>{                   
  //                     res.data[i].eventData['hotelname'] = result.hotelname;
  //                     res.data[i].eventData['hotelstate'] = result.state;
  //                     let imageCount = 0;                      
  //                     if(res.data[i].eventData.photos){
  //                        imageCount = JSON.parse(res.data[i].eventData.photos).length;
  //                     }
  //                     let videoCount = 0;
  //                     if(res.data[i].eventData.videos){
  //                        videoCount = JSON.parse(res.data[i].eventData.videos).length;
  //                     }
  //                     res.data[i].eventData['allCount'] = imageCount + videoCount;                                    
  //                 })  
  //             }
  //             this.totalItems = res.totalData;
  //             this.dataArray = res.data;
  //             console.log(this.dataArray);
  //          }
  //      })
	// }

  onChangeName(e){
    this.name = e.target.value

    this.userService.getAdminliveEventListByName(this.name).subscribe(
      (resLiveEvent:any) =>{
            
        console.log("liveEventList",resLiveEvent);
        // if(resLiveEvent.data[0].guestData === null){
        //   return this.dataArray = resLiveEvent.data[0].guestData;

        // }
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
          console.log(this.dataArray, "hhhhhhhhhhhhhhhh");
       }
       })
  }

  deleteFeed(id){
    console.log(id, "iddddddddddddd111111111>>>>>>>>>>>>>")
    this.userService.deleteAdminFeed(id).subscribe(
      (response:any) =>{
        this.getLiveEvents()
                },
    );
   }
   delete(id){
     console.log(id, "iddddddddd")
     this.DeletefeedId = id
   }
  
  pageChangeEvent(event: number) {
    this.p = event;
   this.getLiveEvents()

  }
}
