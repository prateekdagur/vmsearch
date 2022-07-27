import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { HttpClientModule }    from '@angular/common/http';
import { Router,ActivatedRoute } from "@angular/router";
import { environment } from 'src/environments/environment';
import {formatDate} from '@angular/common'

@Component({
  selector: 'app-admin-feedback-details',
  templateUrl: './admin-feedback-details.component.html',
  styleUrls: ['./admin-feedback-details.component.scss']
})
export class AdminFeedbackDetailsComponent implements OnInit {
  id:any;
  dataArray:any;
  dateFormat = environment.dateFormat;

  constructor(private httpClientModule:HttpClientModule, private router:Router,private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
			this.id = params['id'];
		});

    this.userService.getFeedbackDetails(this.id).subscribe(
      (res:any) =>{
          if(res.statusText == 'success'){
           
              let feedbackCount = res.guestFeedbackList.length;
              res.user['formated_dob'] = formatDate(res.user.dob, this.dateFormat, 'en');
              res.user['formated_dlExpiry'] = formatDate(res.user.dlExpiryDate, this.dateFormat, 'en');

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
