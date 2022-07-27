import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { HttpClientModule }    from '@angular/common/http';
import { Router,ActivatedRoute } from "@angular/router";
import { environment } from 'src/environments/environment';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-feedback-rejected',
  templateUrl: './feedback-rejected.component.html',
  styleUrls: ['./feedback-rejected.component.scss']
})
export class FeedbackRejectedComponent implements OnInit {
  id:any;
  dataArray:any;
  dateFormat = environment.dateFormat;

  constructor(private httpClientModule:HttpClientModule, private router:Router,private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
   
    this.userService.getFeedbackRejected().subscribe(
      (res:any) =>{
        console.log(res);
          if(res.statusText == 'success'){
           
              let feedbackCount = res.guestFeedbackList.length;
             

              for(let i=0;i<feedbackCount;i++){
              
                let photo = [];
                if(res.guestFeedbackList[i].guestDetails.photos){
                  photo = JSON.parse(res.guestFeedbackList[i].guestDetails.photos);
                }

                let video = [];
                if(res.guestFeedbackList[i].guestDetails.videos){
                  video = JSON.parse(res.guestFeedbackList[i].guestDetails.videos);
                }

                let dnrReason =  [];
                
                if(res.guestFeedbackList[i].guestDetails.dnrReason){
                  dnrReason = JSON.parse(res.guestFeedbackList[i].guestDetails.dnrReason);
                }

                res.guestFeedbackList[i]['photosArray'] = photo;
                res.guestFeedbackList[i]['videoArray'] = video;
                res.guestFeedbackList[i]['drReasonArray'] = dnrReason;

              }
             
              res['feedbackCount'] = feedbackCount;
              
              this.dataArray = res;
              
              console.log(this.dataArray);
          }
      });
  }

}