import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from 'src/app/shared/user.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-frontdesk-home',
  templateUrl: './frontdesk-home.component.html',
  styleUrls: ['./frontdesk-home.component.scss']
})
export class FrontdeskHomeComponent implements OnInit {
  dataArray:any;
  dateFormat = environment.dateFormat;
  liveEventsCount:any;
  dnrlistCount:any;
  displayStyleSearch= "none";  
  searchResult:any;
  searchValue:any;
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
                this.dataArray.liveEvents[index].eventData['dnrReason'] = JSON.parse(this.dataArray.liveEvents[index].eventData.dnrReason);
            }
        }
           
        }
        this.liveEventsCount=this.dataArray.liveEvents.length;
        this.introVideo = this.dataArray.contactData.introduction_video_url;
        this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.introVideo);
      })
  }

  openSearch() {
    this.displayStyleSearch= "block";
    
  }

  closeSearch(){
    this.displayStyleSearch= "none";
  }

  searchGuest(event){
    this.searchValue = event.target.value;
    this.userService.searchGuest(this.searchValue).subscribe(
      (res:any) =>{ 
          if(res.statusText == "success"){ 
            this.searchResult = res.user;
          }
      });
  }
  

  searchGuestLiting(){
    this.displayStyleSearch= "none";
    this.router.navigate(['/search-result/'+this.searchValue]).then(() => {
      window.location.reload();
    });
  }

}
