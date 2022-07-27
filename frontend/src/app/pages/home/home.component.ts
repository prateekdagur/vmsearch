import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from 'src/app/shared/user.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  dataArray:any;
  dateFormat = environment.dateFormat;
  liveEventsCount:any;
  dnrlistCount:any;
  public safeURL: SafeResourceUrl;
  introVideo:any;
  constructor(private userService:UserService, private router:Router,private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {

    this.userService.dashboard().subscribe(
      (res:any) =>{
        if(res.statusText == "success"){  
          
          this.dataArray = res;
            
          for(let index=0; index<this.dataArray.liveEvents.length; index++){   
              let dnrReason = [];          
              if(this.dataArray.liveEvents[index].eventData.dnrReason){
                this.dataArray.liveEvents[index].eventData['dnrReasonArray'] = JSON.parse(this.dataArray.liveEvents[index].eventData.dnrReason);
              }
          }
          
          for(let index=0; index<this.dataArray.dnrList.length; index++){   
            let dnrReason = [];          
            if(this.dataArray.dnrList[index].eventData.dnrReason){
              this.dataArray.dnrList[index].eventData['dnrReasonArray'] = JSON.parse(this.dataArray.dnrList[index].eventData.dnrReason);
            }
        }
           
        }

        this.liveEventsCount=this.dataArray.liveEvents.length;
        this.dnrlistCount=this.dataArray.dnrList.length;
        this.introVideo = this.dataArray.contactData.introduction_video_url;
        this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.introVideo);

      })

  }

}
